package controller

import (
	"github.com/gin-gonic/gin"
	"github.com/helloeve02/CPE681012/entity"
	"github.com/helloeve02/CPE681012/config"
	"net/http"
)

// GetMealsByMealday - ดึงมื้อทั้งหมดในวันหนึ่ง 
func GetMealsByMealday(c *gin.Context) {
	mealdayID := c.Param("mealdayID")
	db := config.DB()
	var meals []entity.Meal

	if err := db.Preload("MealItems.Menu").Where("mealday_id = ?", mealdayID).Find(&meals).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถดึงข้อมูลมื้ออาหารได้"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"meals": meals})
}

// CreateMeal - เพิ่มมื้อใหม่ 
func CreateMeal(c *gin.Context) {
	db := config.DB()
	var input entity.Meal

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ข้อมูลไม่ถูกต้อง"})
		return
	}

	if err := db.Create(&input).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถเพิ่มมื้ออาหารได้"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"meal": input})
}

// UpdateMeal - แก้ไขมื้ออาหาร
func UpdateMeal(c *gin.Context) {
	db := config.DB()
	id := c.Param("id")
	var meal entity.Meal

	if err := db.First(&meal, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "ไม่พบมื้ออาหารนี้"})
		return
	}

	var input entity.Meal
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ข้อมูลไม่ถูกต้อง"})
		return
	}

	db.Model(&meal).Updates(input)
	c.JSON(http.StatusOK, gin.H{"meal": meal})
}

// DeleteMeal - ลบมื้ออาหาร
func DeleteMeal(c *gin.Context) {
	db := config.DB()
	id := c.Param("id")
	var meal entity.Meal

	if err := db.First(&meal, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "ไม่พบมื้ออาหารนี้"})
		return
	}

	db.Delete(&meal)
	c.JSON(http.StatusOK, gin.H{"message": "ลบมื้ออาหารเรียบร้อยแล้ว"})
}
