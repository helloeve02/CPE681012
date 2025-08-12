package controller

import (
	"github.com/gin-gonic/gin"
	"github.com/helloeve02/CPE681012/entity"
	"github.com/helloeve02/CPE681012/config"
	"net/http"
)

func GetAllTag(c *gin.Context) {
	var tag []entity.Tag

	// เรียกใช้งาน DB จาก config
	db := config.DB()

	// Query ดึงเมนูทั้งหมด พร้อม preload รูปภาพ
	err := db.Find(&tag).Error
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถดึงข้อมูล tag ทั้งหมดได้"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"tag": tag})
}

func GetTagByID(c *gin.Context) {
	// รับค่า menuID จากพารามิเตอร์ใน URL
	tagID := c.Param("id")

	// กำหนด struct สำหรับเก็บผลลัพธ์ที่จะ return
	var tag entity.Tag

	// Get the database connection
	db := config.DB()

	// Query with joins to get the menu by ID and preload related images
	err := db.First(&tag, "id = ?", tagID).Error
	if err != nil {
		// Handle errors and return an appropriate response
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to fetch menu details"})
		return
	}

	// Return the fetched menu as a JSON response
	c.JSON(http.StatusOK, gin.H{"tag": tag})
}
