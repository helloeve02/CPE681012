package controller

import (
	"github.com/gin-gonic/gin"
	"github.com/helloeve02/CPE681012/entity"
	"github.com/helloeve02/CPE681012/config"
	"net/http"
)

// GetMealMenusByMeal - ดึงรายการเมนูของมื้ออาหารหนึ่ง
func GetMealMenusByMeal(c *gin.Context) {
	mealID := c.Param("mealID")
	db := config.DB()
	var items []entity.MealMenu

	if err := db.Preload("Menu").Where("meal_id = ?", mealID).Find(&items).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถดึงรายการเมนูได้"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"mealMenus": items})
}

// CreateMealMenu - เพิ่มเมนูในมื้ออาหาร
func CreateMealMenu(c *gin.Context) {
	db := config.DB()
	var input entity.MealMenu

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ข้อมูลไม่ถูกต้อง"})
		return
	}

	if err := db.Create(&input).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถเพิ่มเมนูได้"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"mealMenu": input})
}

// DeleteMealMenu - ลบเมนูออกจากมื้ออาหาร
func DeleteMealMenu(c *gin.Context) {
	db := config.DB()
	id := c.Param("id")
	var item entity.MealMenu

	if err := db.First(&item, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "ไม่พบรายการเมนูนี้"})
		return
	}

	db.Delete(&item)
	c.JSON(http.StatusOK, gin.H{"message": "ลบเมนูออกจากมื้อเรียบร้อยแล้ว"})
}
