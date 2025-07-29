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
