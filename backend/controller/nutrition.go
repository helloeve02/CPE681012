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

	// Inline IBW calculation
	calculateIBW := func(height float64, gender string) float64 {
		if gender == "male" {
			return (height - 100)
		}
		return (height - 105)
	}

	ibw := calculateIBW(input.Height, input.Gender)

	// query result
	var ruleID int

	// Raw SQL query with joins and conditions
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

	db := config.DB()
	err := db.Raw(query, input.Age, ibw, input.DiseaseStage).Scan(&ruleID).Error

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database query failed"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": ruleID})
}

func GetNutritionRecommendationByRule(c *gin.Context) {
	// รับค่า Rule จากพารามิเตอร์ใน URL
	rule := c.Param("rule")

	// กำหนด struct สำหรับเก็บผลลัพธ์ที่จะ return
	var nutritionRecommendations []entity.NutritionRecommendation

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

	// กำหนด struct สำหรับเก็บผลลัพธ์ที่จะ return
	var portionRecommendations []entity.PortionRecommendation

	// Get the database connection
	db := config.DB()

	query := `
		SELECT food_groups.name, food_groups.unit, meal_times.name, portion_recommendations.amount
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
