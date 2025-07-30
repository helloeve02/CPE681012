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

func GetRuleByUserInfo(c *gin.Context) {
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

// SELECT
// 			rules.calories,
// 			nutrition_reccomentations.amount,
// 			nutrition_groups.name AS nutrition_group
// 		FROM rules
// 		JOIN nutrition_reccomentations ON rules.id = nutrition_reccomentations.rule_id
// 		JOIN age_ranges ON age_ranges.id = rules.age_range_id
// 		JOIN ibw_ranges ON ibw_ranges.id = rules.ibw_range_id
// 		JOIN diseases ON diseases.id = rules.disease_id
// 		JOIN nutrition_groups ON nutrition_groups.id = nutrition_reccomentations.nutrition_id
// 		WHERE ? BETWEEN age_ranges.age_min AND age_ranges.age_max
// 		  AND ? BETWEEN ibw_ranges.ibw_min AND ibw_ranges.ibw_max
// 		  AND diseases.stage = ?
