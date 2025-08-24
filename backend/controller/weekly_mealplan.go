package controller

import (
	"math/rand"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/helloeve02/CPE681012/config"
	"github.com/helloeve02/CPE681012/entity"
)

func GenerateWeeklyMealPlan(c *gin.Context) {
	var input struct {
		DiseaseID uint     `json:"diseaseID"`
		TagIDs    []uint   `json:"tagIDs"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ข้อมูลไม่ถูกต้อง"})
		return
	}

	db := config.DB()
	rand.Seed(time.Now().UnixNano())

	var normalMenus []entity.Menu
	db.Joins("JOIN menu_tags mt ON mt.menu_id = menus.id").
		Where("mt.tag_id IN ?", input.TagIDs).
		Where("menus.id NOT IN (SELECT menu_id FROM menu_tags WHERE tag_id = ?)", /* tagID ของหวาน */ 5).
		Find(&normalMenus)

	var snackMenus []entity.Menu
	db.Joins("JOIN menu_tags mt ON mt.menu_id = menus.id").
		Where("mt.tag_id = ?", 5). // 5 = ของหวาน
		Find(&snackMenus)

	var fruits []entity.FoodItem
	db.Joins("JOIN food_groups fg ON fg.id = food_items.food_group_id").
		Where("fg.name = ?", "ผลไม้").
		Where("food_items.food_flag_id = ?", 3). // ควรรับประทาน
		Find(&fruits)

	plan := []map[string]interface{}{}
	days := []string{"จันทร์", "อังคาร", "พุธ", "พฤหัส", "ศุกร์", "เสาร์", "อาทิตย์"}

	for _, day := range days {
		dayMeals := map[string]interface{}{
			"day": day,
			"breakfast": normalMenus[rand.Intn(len(normalMenus))],
			"lunch":     normalMenus[rand.Intn(len(normalMenus))],
			"dinner":    normalMenus[rand.Intn(len(normalMenus))],
		}

		if rand.Intn(2) == 0 && len(fruits) > 0 {
			dayMeals["snack"] = fruits[rand.Intn(len(fruits))]
		} else if len(snackMenus) > 0 {
			dayMeals["snack"] = snackMenus[rand.Intn(len(snackMenus))]
		}

		plan = append(plan, dayMeals)
	}

	c.JSON(http.StatusOK, gin.H{"weeklyMealPlan": plan})
}
