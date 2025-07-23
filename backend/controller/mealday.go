package controller

import (
	"github.com/gin-gonic/gin"
	"github.com/helloeve02/CPE681012/entity"
	"github.com/helloeve02/CPE681012/config"
	"net/http"
)

// GetMealDaysByMealplan - ดึงวันทั้งหมดใน Mealplan ID หนึ่ง (7 วัน)
func GetMealDaysByMealplan(c *gin.Context) {
	mealplanID := c.Param("mealplanID")
	db := config.DB()
	var mealdays []entity.Mealday

	if err := db.Where("mealplan_id = ?", mealplanID).Find(&mealdays).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถดึงข้อมูลวันได้"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"mealdays": mealdays})
}

// CreateMealDay - เพิ่มวันใหม่ในแผน (admin)
func CreateMealDay(c *gin.Context) {
	db := config.DB()
	var input entity.Mealday

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ข้อมูลไม่ถูกต้อง"})
		return
	}

	if err := db.Create(&input).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถเพิ่มวันได้"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"mealday": input})
}

// UpdateMealDay - แก้ไขวัน (admin)
func UpdateMealDay(c *gin.Context) {
	db := config.DB()
	id := c.Param("id")
	var mealday entity.Mealday

	if err := db.First(&mealday, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "ไม่พบวันดังกล่าว"})
		return
	}

	var input entity.Mealday
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ข้อมูลไม่ถูกต้อง"})
		return
	}

	db.Model(&mealday).Updates(input)
	c.JSON(http.StatusOK, gin.H{"mealday": mealday})
}

// DeleteMealDay - ลบวันออกจากแผน (admin)
func DeleteMealDay(c *gin.Context) {
	db := config.DB()
	id := c.Param("id")
	var mealday entity.Mealday

	if err := db.First(&mealday, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "ไม่พบวันดังกล่าว"})
		return
	}

	db.Delete(&mealday)
	c.JSON(http.StatusOK, gin.H{"message": "ลบวันเรียบร้อยแล้ว"})
}