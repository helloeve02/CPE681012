package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/helloeve02/CPE681012/config"
	"github.com/helloeve02/CPE681012/entity"
)

// แสดงข้อมูลทั้งหมด
func GetAllFoodFlags(c *gin.Context) {
	var foodflags []entity.FoodFlag

	db := config.DB()
	if err := db.Find(&foodflags).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถดึงข้อมูล FoodFlag ได้"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"foodflags": foodflags})
}

// แสดงข้อมูลตาม ID
func GetFoodFlagByID(c *gin.Context) {
	id := c.Param("id")

	var foodflag entity.FoodFlag
	db := config.DB()
	if err := db.First(&foodflag, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "ไม่พบข้อมูล FoodFlag"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"foodflag": foodflag})
}