package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/helloeve02/CPE681012/config"
	"github.com/helloeve02/CPE681012/entity"
)

func GetAllDisease(c *gin.Context) {
	var diseases []entity.Disease

	db := config.DB()

	if err := db.Find(&diseases).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถดึงข้อมูลระยะโรคได้"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"diseases": diseases})
}

func FindRuleByUserInfo(c *gin.Context) {
	// Define the input struct directly inside the function
	type UserInput struct {
		Age          int     `json:"age"`
		Height       float64 `json:"height"`
		Gender       string  `json:"gender"`
		DiseaseStage string  `json:"disease_stage"`
	}

	// Parse incoming JSON
	var input UserInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	// Basic input completeness check
	if input.Age <= 0 || input.Height <= 0 || input.Gender == "" || input.DiseaseStage == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "กรุณากรอกข้อมูลให้ครบถ้วน"})
		return
	}

	// Inline IBW calculation
	calculateIBW := func(height float64, gender string) float64 {
		if gender == "male" {
			return (height - 100)
		}
		return (height - 105)
	}

	ibw := calculateIBW(input.Height, input.Gender)

	db := config.DB()

	// Validate Age range
	var ageMatch bool
	err := db.Raw(`SELECT EXISTS (SELECT 1 FROM age_ranges WHERE ? BETWEEN age_min AND age_max)`, input.Age).Scan(&ageMatch).Error
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "เกิดข้อผิดพลาดในการตรวจสอบช่วงอายุ",
			"details": err.Error(),
		})
		return
	}
	if !ageMatch {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ขออภัย อายุของคุณไม่อยู่ในช่วงที่รองรับ"})
		return
	}

	// Validate IBW range
	var ibwMatch bool
	err = db.Raw(`SELECT EXISTS (SELECT 1 FROM ibw_ranges WHERE ? BETWEEN ibw_min AND ibw_max)`, ibw).Scan(&ibwMatch).Error
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "เกิดข้อผิดพลาดในการตรวจสอบช่วง IBW",
			"details": err.Error(),
		})
		return
	}
	if !ibwMatch {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ขออภัย ส่วนสูงของคุณอยู่นอกช่วงที่ระบบรองรับ"})
		return
	}

	// Validate Disease stage
	var diseaseMatch bool
	err = db.Raw(`SELECT EXISTS (SELECT 1 FROM diseases WHERE stage = ?)`, input.DiseaseStage).Scan(&diseaseMatch).Error
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "เกิดข้อผิดพลาดในการตรวจสอบข้อมูลโรค",
			"details": err.Error(),
		})
		return
	}
	if !diseaseMatch {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ข้อมูลระยะของโรคไม่ถูกต้อง"})
		return
	}

	// Now find the matching rule
	var ruleID int
	query := `
		SELECT rules.id
		FROM rules
		JOIN age_ranges ON age_ranges.id = rules.age_range_id
		JOIN ibw_ranges ON ibw_ranges.id = rules.ibw_range_id
		JOIN diseases ON diseases.id = rules.disease_id
		WHERE ? BETWEEN age_ranges.age_min AND age_ranges.age_max
		  AND ? BETWEEN ibw_ranges.ibw_min AND ibw_ranges.ibw_max
		  AND diseases.stage = ?
		  LIMIT 1;
	`
	err = db.Raw(query, input.Age, ibw, input.DiseaseStage).Scan(&ruleID).Error
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "เกิดข้อผิดพลาดในการค้นหาข้อมูล",
			"details": err.Error(),
		})
		return
	}

	if ruleID == 0 {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "ไม่พบคำแนะนำที่ตรงกับข้อมูลของคุณ",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": ruleID})
}


func GetNutritionRecommendationByRule(c *gin.Context) {
	// รับค่า Rule จากพารามิเตอร์ใน URL
	rule := c.Param("rule")

	type NutritionRecommendationResponse struct {
		NutritionGroupName string  `gorm:"column:nutrition_group_name"`
		AmountInGrams      float64 `gorm:"column:amount_in_grams"`
		AmountInPercentage float64 `gorm:"column:amount_in_percentage"`
	}

	// กำหนด struct สำหรับเก็บผลลัพธ์ที่จะ return
	var nutritionRecommendations []NutritionRecommendationResponse

	// Get the database connection
	db := config.DB()

	query := `
		SELECT  nutrition_groups.name AS nutrition_group_name,
				nutrition_recommendations.amount_in_grams,
				nutrition_recommendations.amount_in_percentage
		FROM nutrition_recommendations
		JOIN nutrition_groups ON nutrition_groups.id = nutrition_recommendations.nutrition_group_id
		WHERE nutrition_recommendations.rule_id = ?;
		`
	// Query with joins to get the menu by ID and preload related images
	err := db.Raw(query, rule).Scan(&nutritionRecommendations).Error
	if err != nil {
		// Handle errors and return an appropriate response
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to fetch nutrition recommendations"})
		return
	}

	// Return the fetched menu as a JSON response
	c.JSON(http.StatusOK, gin.H{"nutritionRecommendations": nutritionRecommendations})
}

func GetPortionRecommendationByRule(c *gin.Context) {
	// รับค่า Rule จากพารามิเตอร์ใน URL
	rule := c.Param("rule")

	type PortionRecommendationResponse struct {
		FoodGroupName string  `gorm:"column:food_group_name"`
		Unit          string  `gorm:"column:unit"`
		MealTimeName  string  `gorm:"column:meal_time_name"`
		Amount        float32 `gorm:"column:amount"`
	}

	// กำหนด struct สำหรับเก็บผลลัพธ์ที่จะ return
	var portionRecommendations []PortionRecommendationResponse

	// Get the database connection
	db := config.DB()

	query := `
		SELECT food_groups.name AS food_group_name, food_groups.unit, meal_times.name AS meal_time_name, portion_recommendations.amount
		FROM portion_recommendations
		JOIN food_groups ON food_groups.id = portion_recommendations.food_group_id
		JOIN meal_times ON meal_times.id = portion_recommendations.meal_time_id
		WHERE portion_recommendations.rule_id = ?;
		`
	// Query with joins to get the menu by ID and preload related images
	err := db.Raw(query, rule).Scan(&portionRecommendations).Error
	if err != nil {
		// Handle errors and return an appropriate response
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to fetch portion recommendations"})
		return
	}

	// Return the fetched menu as a JSON response
	c.JSON(http.StatusOK, gin.H{"portionRecommendations": portionRecommendations})
}

func GetCaloriesByRuleID(c *gin.Context) {
	ruleID := c.Param("rule")
	var calories int

	db := config.DB()

	err := db.Model(&entity.Rule{}).
		Select("calories").
		Where("id = ?", ruleID).
		Scan(&calories).Error

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to fetch calories"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"calories": calories})
}

func GetRuleDetailsByRuleID(c *gin.Context) {
	rule := c.Param("rule")

	type RuleDetails struct {
		DiseaseName  string `gorm:"column:name"`
		DiseaseStage string `gorm:"column:stage"`
		AgeMin       int32  `gorm:"column:age_min"`
		AgeMax       int32  `gorm:"column:age_max"`
		IBWMin       int32  `gorm:"column:ibw_min"`
		IBWMax       int32  `gorm:"column:ibw_max"`
	}

	var ruleDetail RuleDetails

	db := config.DB()

	query := `
		SELECT 
    		diseases.name, 
			diseases.stage,
    		age_ranges.age_min, 
    		age_ranges.age_max, 
    		ibw_ranges.ibw_min, 
    		ibw_ranges.ibw_max
		FROM rules
		JOIN diseases ON diseases.id = rules.disease_id
		JOIN age_ranges ON age_ranges.id = rules.age_range_id
		JOIN ibw_ranges ON ibw_ranges.id = rules.ibw_range_id
		WHERE rules.id = ?;
		`

	err := db.Raw(query, rule).Scan(&ruleDetail).Error

	if err != nil {
		// Handle errors and return an appropriate response
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to fetch rule detail."})
		return
	}

	c.JSON(http.StatusOK, gin.H{"RuleDetail": ruleDetail})
}
