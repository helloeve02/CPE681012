package controller

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/helloeve02/CPE681012/config"
	"github.com/helloeve02/CPE681012/entity"
	"gorm.io/gorm"
)

func GetAllMenu(c *gin.Context) {
	var menu []entity.Menu

	// เรียกใช้งาน DB จาก config
	db := config.DB()

	// Query ดึงเมนูทั้งหมด พร้อม preload รูปภาพ
	err := db.Preload("Tags").
   Preload("Admin").
   Preload("MealMenus").Find(&menu).Error
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถดึงข้อมูลเมนูทั้งหมดได้"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"menu": menu})
}

func GetMenuByID(c *gin.Context) {
	// รับค่า menuID จากพารามิเตอร์ใน URL
	menuID := c.Param("id")

	// กำหนด struct สำหรับเก็บผลลัพธ์ที่จะ return
	var menu entity.Menu

	// Get the database connection
	db := config.DB()

	// Query with joins to get the menu by ID and preload related images
	err := db.First(&menu, "id = ?", menuID).Error
	if err != nil {
		// Handle errors and return an appropriate response
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to fetch menu details"})
		return
	}

	// Return the fetched menu as a JSON response
	c.JSON(http.StatusOK, gin.H{"menu": menu})
}


func DeleteMenu(c *gin.Context) {
	id := c.Param("id")
	db := config.DB()
	if tx := db.Exec("DELETE FROM menus WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Deleted successfully"})
}

func CreateMenu(c *gin.Context) {
    var menu entity.Menu  // รับข้อมูลเป็น array ของ OrderItems
    db := config.DB()

    // รับข้อมูล JSON จาก client
    if err := c.ShouldBindJSON(&menu); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    // ใช้ GORM สร้างหลายรายการคำสั่งซื้อ
    if err := db.Create(&menu).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusCreated, gin.H{
        "message": "menu created successfully",
        "menu": menu,  // ส่งคืนรายการคำสั่งซื้อที่ถูกสร้าง
    })
}

func PatchMenu(db *gorm.DB, id uint, updates map[string]interface{}) (*entity.Menu, error) {
	var menu entity.Menu

	// หา record ที่ต้องการ
	if err := db.First(&menu, id).Error; err != nil {
		return nil, errors.New("menu not found")
	}

	// อัปเดตเฉพาะ field ที่ส่งมา
	if err := db.Model(&menu).Updates(updates).Error; err != nil {
		return nil, err
	}

	// โหลดข้อมูลใหม่หลังอัปเดต
	if err := db.First(&menu, id).Error; err != nil {
		return nil, err
	}

	return &menu, nil
}