package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/helloeve02/CPE681012/config"
	"github.com/helloeve02/CPE681012/entity"
)

// แสดงข้อมูลทั้งหมด
func GetAllFoodExchanges(c *gin.Context) {
	var foodexchanges []entity.FoodExchange

	db := config.DB()
	if err := db.
		Preload("FoodItem").
		Preload("FoodItem.FoodFlag").
		Preload("FoodItem.FoodFlag.FoodGroup").
		Find(&foodexchanges).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถดึงข้อมูล FoodExchange ได้"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"foodexchanges": foodexchanges})
}
