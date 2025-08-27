package controller

import (
	"math/rand"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/helloeve02/CPE681012/config"
	"github.com/helloeve02/CPE681012/entity"
)

/* func GenerateWeeklyMealPlan(c *gin.Context) {
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
		Where("menus.id NOT IN (SELECT menu_id FROM menu_tags WHERE tag_id = ?)", /* tagID ของหวาน */ /*15).
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

//ของหวานปกติ
func GetDesserts(c *gin.Context) {
	var desserts []entity.Menu
	db := config.DB()

	if err := db.Joins("JOIN menu_tags mt ON mt.menu_id = menus.id").
		Where("mt.tag_id = ?", 15).
		Find(&desserts).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถดึงของหวานได้"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"desserts": desserts})
}

//ของหวานเบาหวาน
func GetDiabeticDesserts(c *gin.Context) {
	var desserts []entity.Menu
	db := config.DB()

	err := db.Joins("JOIN menu_tags mt ON mt.menu_id = menus.id").
		Joins("JOIN meal_menus mm ON mm.menu_id = menus.id").
		Joins("JOIN meals m ON m.id = mm.meal_id").
		Joins("JOIN mealdays md ON md.id = m.mealday_id").
		Joins("JOIN mealplans mp ON mp.id = md.mealplan_id").
		Where("mt.tag_id = ?", 16).   // ของหวานสำหรับเบาหวาน
		Where("mp.disease_id = ?", 5). // โรคเบาหวาน
		Group("menus.id").
		Find(&desserts).Error

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถดึงของหวานสำหรับโรคเบาหวานได้"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"diabeticDesserts": desserts})
}

//ดึงเมนูมื้อหลักตาม Tag ที่ผู้ใช้เลือก
func GetMenusByTagIDs(c *gin.Context) {
	var input struct {
		TagIDs []uint `json:"tagIDs"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ข้อมูลไม่ถูกต้อง"})
		return
	}

	if len(input.TagIDs) == 0 {
		c.JSON(http.StatusOK, gin.H{"menus": []entity.Menu{}})
		return
	}

	var menus []entity.Menu
	db := config.DB()

	err := db.Joins("JOIN menu_tags mt ON mt.menu_id = menus.id").
		Where("mt.tag_id IN ?", input.TagIDs).
		Group("menus.id").
		Find(&menus).Error

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถดึงเมนูตาม Tag ได้"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"menus": menus})
} */
 func GenerateWeeklyMealPlan(c *gin.Context) {
	var input struct {
		DiseaseID uint   `json:"diseaseID"`
		TagIDs    []uint `json:"tagIDs"`
	}
	
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ข้อมูลไม่ถูกต้อง"})
		return
	}

	db := config.DB()
	rand.Seed(time.Now().UnixNano())

	// ดึงเมนูมื้อหลัก (ไม่ใช่ของหวาน)
	var mainMenus []entity.Menu
	query := db.Preload("Tags").
		Joins("JOIN menu_tags mt ON mt.menu_id = menus.id").
		Where("menus.id NOT IN (SELECT DISTINCT menu_id FROM menu_tags WHERE tag_id IN (15, 16))") // ไม่เอาของหวานทั้งหมด
	
	if len(input.TagIDs) > 0 {
		query = query.Where("mt.tag_id IN ?", input.TagIDs)
	}
	
	if err := query.Group("menus.id").Find(&mainMenus).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถดึงเมนูหลักได้"})
		return
	}

	// ดึงผลไม้ที่ควรรับประทาน
	var fruits []entity.FoodItem
	if err := db.Where("food_flag_id = ?", 3).Find(&fruits).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถดึงผลไม้ได้"})
		return
	}

	// ดึงของหวาน (แยกตามโรค)
	var dessertMenus []entity.Menu
	var dessertTagID uint = 15 // ของหวานปกติ
	
	// ถ้าเป็นโรคเบาหวาน (DiseaseID = 5) ให้ใช้ TagID = 16
	if input.DiseaseID == 5 {
		dessertTagID = 16
	}
	
	if err := db.Preload("Tags").
		Joins("JOIN menu_tags mt ON mt.menu_id = menus.id").
		Where("mt.tag_id = ?", dessertTagID).
		Find(&dessertMenus).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถดึงของหวานได้"})
		return
	}

	// สร้างแผนอาหาร 7 วัน
	plan := []map[string]interface{}{}
	days := []string{"วันจันทร์", "วันอังคาร", "วันพุธ", "วันพฤหัสบดี", "วันศุกร์", "วันเสาร์", "วันอาทิตย์"}
	mealTypes := []string{"เช้า", "ว่างเช้า", "กลางวัน", "ว่างบ่าย", "เย็น"}

	for _, day := range days {
		dayMeals := map[string]interface{}{
			"day": day,
		}

		for _, mealType := range mealTypes {
			if mealType == "ว่างเช้า" || mealType == "ว่างบ่าย" {
				// สุ่มระหว่างผลไม้ (70%) กับของหวาน (30%)
				if rand.Float32() < 0.7 && len(fruits) > 0 {
					dayMeals[mealType] = fruits[rand.Intn(len(fruits))]
				} else if len(dessertMenus) > 0 {
					dayMeals[mealType] = dessertMenus[rand.Intn(len(dessertMenus))]
				} else {
					dayMeals[mealType] = nil
				}
			} else {
				// มื้อหลัก
				if len(mainMenus) > 0 {
					dayMeals[mealType] = mainMenus[rand.Intn(len(mainMenus))]
				} else {
					dayMeals[mealType] = nil
				}
			}
		}

		plan = append(plan, dayMeals)
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"weeklyMealPlan": plan,
		"diseaseID": input.DiseaseID,
		"usedTags": input.TagIDs,
	})
}

// ดึงของหวานทั่วไป
func GetDesserts(c *gin.Context) {
	var desserts []entity.Menu
	db := config.DB()

	if err := db.Preload("Tags").
		Joins("JOIN menu_tags mt ON mt.menu_id = menus.id").
		Where("mt.tag_id = ?", 15). // TagID = 15 สำหรับของหวานทั่วไป
		Find(&desserts).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถดึงของหวานได้"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"desserts": desserts,
	})
}

// ดึงของหวานสำหรับเบาหวาน
func GetDiabeticDesserts(c *gin.Context) {
	var desserts []entity.Menu
	db := config.DB()

	if err := db.Preload("Tags").
		Joins("JOIN menu_tags mt ON mt.menu_id = menus.id").
		Where("mt.tag_id = ?", 16). // TagID = 16 สำหรับของหวานเบาหวาน
		Find(&desserts).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถดึงของหวานสำหรับโรคเบาหวานได้"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"diabeticDesserts": desserts,
	})
}

// ดึงเมนูตาม TagIDs
func GetMenusByTagIDs(c *gin.Context) {
	var input struct {
		TagIDs []uint `json:"tagIDs"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ข้อมูลไม่ถูกต้อง"})
		return
	}

	var menus []entity.Menu
	db := config.DB()

	query := db.Preload("Tags")
	
	if len(input.TagIDs) > 0 {
		query = query.Joins("JOIN menu_tags mt ON mt.menu_id = menus.id").
			Where("mt.tag_id IN ?", input.TagIDs).
			Group("menus.id")
	}

	if err := query.Find(&menus).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถดึงเมนูได้"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"menus": menus,
	})
}

func GetFruits(c *gin.Context) {
	var fruits []entity.FoodItem
	db := config.DB()

	if err := db.Preload("FoodFlag").
		Where("food_flag_id = ?", 3). // FoodFlagID = 3 ควรรับประทาน
		Find(&fruits).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถดึงผลไม้ได้"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"fruits": fruits,
	})
}