package controller

import (
	"github.com/gin-gonic/gin"
	"github.com/helloeve02/CPE681012/entity"
	"github.com/helloeve02/CPE681012/config"
	"net/http"
)

func GetAllContent(c *gin.Context) {
	var menu []entity.EducationalContent

	// เรียกใช้งาน DB จาก config
	db := config.DB()

	// Query ดึงเมนูทั้งหมด พร้อม preload รูปภาพ
	err := db.Find(&menu).Error
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถดึงข้อมูลเมนูทั้งหมดได้"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"menu": menu})
}

func GetContentByID(c *gin.Context) {
	// รับค่า menuID จากพารามิเตอร์ใน URL
	menuID := c.Param("id")

	// กำหนด struct สำหรับเก็บผลลัพธ์ที่จะ return
	var menu entity.EducationalContent

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


func DeleteContent(c *gin.Context) {
	id := c.Param("id")
	db := config.DB()
	if tx := db.Exec("DELETE FROM educational_contents WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Deleted successfully"})
}


func CreateContent(c *gin.Context) {
    var menu entity.EducationalContent  // รับข้อมูลเป็น array ของ OrderItems
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
func GetContentByArticle(c *gin.Context) {
	var educationalContent []entity.EducationalContent

	db := config.DB()

	// ถ้าต้องการดึง ID = 1 อย่างเดียว
	if err := db.Preload("ContentCategory").
		Where("content_category_id = ?", 1).
		Find(&educationalContent).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถดึงข้อมูล EducationalContent ได้"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"educationalContents": educationalContent})
}

func GetContentByInfographics(c *gin.Context) {
	var educationalContent []entity.EducationalContent

	db := config.DB()

	// ถ้าต้องการดึง ID = 3 อย่างเดียว
	if err := db.Preload("ContentCategory").
		Where("content_category_id = ?", 3).
		Find(&educationalContent).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถดึงข้อมูล EducationalContent ได้"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"educationalContents": educationalContent})
}

func GetContentByVideo(c *gin.Context) {
	var educationalContent []entity.EducationalContent

	db := config.DB()

	// ถ้าต้องการดึง ID = 2 อย่างเดียว
	if err := db.Preload("ContentCategory").
		Where("content_category_id = ?", 2).
		Find(&educationalContent).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถดึงข้อมูล EducationalContent ได้"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"educationalContents": educationalContent})
}

func GetContentAllByKidney(c *gin.Context) {
	var educationalContent []entity.EducationalContent

	db := config.DB()

	// ถ้าต้องการดึง ID = 1 อย่างเดียว
	if err := db.Preload("EducationalGroup").
		Where("educational_group_id = ?", 1).
		Find(&educationalContent).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถดึงข้อมูล EducationalContent ได้"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"educationalContents": educationalContent})
}

func GetContentAllByDiabetes(c *gin.Context) {
	var educationalContent []entity.EducationalContent

	db := config.DB()

	// ถ้าต้องการดึง ID = 1 อย่างเดียว
	if err := db.Preload("EducationalGroup").
		Where("educational_group_id = ?", 2).
		Find(&educationalContent).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถดึงข้อมูล EducationalContent ได้"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"educationalContents": educationalContent})
}

func GetContentAllByExercise(c *gin.Context) {
	var educationalContent []entity.EducationalContent

	db := config.DB()

	// ถ้าต้องการดึง ID = 1 อย่างเดียว
	if err := db.Preload("EducationalGroup").
		Where("educational_group_id = ?", 3).
		Find(&educationalContent).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถดึงข้อมูล EducationalContent ได้"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"educationalContents": educationalContent})
}
func GetContentAllByNutrition(c *gin.Context) {
	var educationalContent []entity.EducationalContent

	db := config.DB()

	// ถ้าต้องการดึง ID = 1 อย่างเดียว
	if err := db.Preload("EducationalGroup").
		Where("educational_group_id = ?", 4).
		Find(&educationalContent).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถดึงข้อมูล EducationalContent ได้"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"educationalContents": educationalContent})
}

func UpdateContent(c *gin.Context) {
	id := c.Param("id")

	var content entity.EducationalContent
	db := config.DB()
	if err := db.First(&content, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "ไม่พบข้อมูล content"})
		return
	}

	if err := c.ShouldBindJSON(&content); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := db.Save(&content).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถแก้ไขข้อมูล content ได้"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "แก้ไขข้อมูล content สำเร็จ", "content": content})
}