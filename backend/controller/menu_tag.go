package controller

import (
	"github.com/gin-gonic/gin"
	"github.com/helloeve02/CPE681012/entity"
	"github.com/helloeve02/CPE681012/config"
	"net/http"
)

func GetAllMenuTag(c *gin.Context) {
	var menutag []entity.MenuTag

	// เรียกใช้งาน DB จาก config
	db := config.DB()

	// Query ดึงเมนูทั้งหมด พร้อม preload รูปภาพ
	err := db.Find(&menutag).Error
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถดึงข้อมูล tag ทั้งหมดได้"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"menutag": menutag})
}

func GetMenuTagByID(c *gin.Context) {
	// รับค่า menuID จากพารามิเตอร์ใน URL
	menutagID := c.Param("id")

	// กำหนด struct สำหรับเก็บผลลัพธ์ที่จะ return
	var menutag entity.MenuTag

	// Get the database connection
	db := config.DB()

	// Query with joins to get the menu by ID and preload related images
	err := db.First(&menutag, "id = ?", menutagID).Error
	if err != nil {
		// Handle errors and return an appropriate response
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to fetch menu details"})
		return
	}

	// Return the fetched menu as a JSON response
	c.JSON(http.StatusOK, gin.H{"menutag": menutag})
}
