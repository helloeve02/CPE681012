package controller

import (
	// "fmt"
	"net/http"
	// "strconv"
	// "strings"

	"github.com/gin-gonic/gin"
	"github.com/helloeve02/CPE681012/config"
	"github.com/helloeve02/CPE681012/entity"
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

// func HandleGetMenus(c *gin.Context) {
// 	tagIDsParam := c.Param("id") // เช่น "4,6,888"
// 	tagStrs := strings.Split(tagIDsParam, ",")
// 	tagIDs := []uint{}

// 	for _, t := range tagStrs {
// 		id, err := strconv.Atoi(strings.TrimSpace(t))
// 		if err != nil {
// 			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid tag ID"})
// 			return
// 		}
// 		tagIDs = append(tagIDs, uint(id))
// 	}

// 	if len(tagIDs) == 0 {
// 		c.JSON(http.StatusOK, gin.H{"menus": []entity.Menu{}})
// 		return
// 	}

// 	db := config.DB().Debug()

// 	placeholders := make([]string, len(tagIDs))
// 	args := make([]interface{}, len(tagIDs))
// 	for i, id := range tagIDs {
// 		placeholders[i] = "?"
// 		args[i] = id
// 	}
// 	whereClause := fmt.Sprintf("menu_tags.tag_id IN (%s)", strings.Join(placeholders, ","))

// 	var menus []entity.Menu
// 	err := db.Table("menus").
// 		Select("menus.*").
// 		Joins("JOIN menu_tags ON menu_tags.menu_id = menus.id").
// 		Where(whereClause, args...).
// 		Group("menus.id").
// 		Find(&menus).Error
// 	if err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch menus"})
// 		return
// 	}

// 	c.JSON(http.StatusOK, gin.H{"menus": menus})
// }
