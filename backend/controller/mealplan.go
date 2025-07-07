package controller

import (
	"github.com/gin-gonic/gin"
	"github.com/helloeve02/CPE681012/entity"
	"github.com/helloeve02/CPE681012/config"
	"net/http"
)

// GET /mealplans
func GetAllMealplans(c *gin.Context) {
	var mealplans []entity.Mealplan

	// ดึง DB instance จาก config
	db := config.DB()

	// preload: Admin, Disease, Mealdays
	err := db.Preload("Admin").
		Preload("Disease").
		Preload("Mealdays").
		Find(&mealplans).Error

	if err != nil {
		// ถ้ามี error ดึงข้อมูลไม่ได้
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "ไม่สามารถดึงข้อมูล Mealplan ได้",
		})
		return
	}

	// ส่งข้อมูลกลับแบบ JSON
	c.JSON(http.StatusOK, gin.H{
		"mealplans": mealplans,
	})
}

// GET /mealplans/:id
func GetMealplanByID(c *gin.Context) {
	// อ่านค่า id จาก URL เช่น /mealplans/5
	id := c.Param("id")

	var mealplan entity.Mealplan
	db := config.DB()

	// หา Mealplan ที่มี id ตรงกัน
	err := db.Preload("Admin").
		Preload("Disease").
		Preload("Mealdays").
		First(&mealplan, id).Error

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "ไม่พบ Mealplan ที่ระบุ",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{"mealplan": mealplan})
}

// GET /mealplans/by-disease/:id
func GetMealplansByDisease(c *gin.Context) {
	// อ่าน DiseaseID จาก URL เช่น /mealplans/by-disease/2
	diseaseID := c.Param("id")

	var mealplans []entity.Mealplan
	db := config.DB()

	// ค้นหา MealPlan ที่มี DiseaseID ตรงกัน
	err := db.Where("disease_id = ?", diseaseID).
		Preload("Admin").
		Preload("Disease").
		Preload("Mealdays").
		Find(&mealplans).Error

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "ไม่สามารถดึง Mealplan ตาม Disease ได้",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"mealplans": mealplans,
	})
}

// POST /mealplans
func CreateMealplan(c *gin.Context) {
	var input entity.Mealplan

	// Bind ข้อมูลจาก JSON ไปยัง struct
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ข้อมูลไม่ถูกต้อง"})
		return
	}

	db := config.DB()
	if err := db.Create(&input).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "สร้าง Mealplan ไม่สำเร็จ"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"mealplan": input})
}

// PUT /mealplans/:id
func UpdateMealplan(c *gin.Context) {
	id := c.Param("id")
	var mealplan entity.Mealplan

	db := config.DB()
	if err := db.First(&mealplan, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "ไม่พบ Mealplan"})
		return
	}

	// รับข้อมูลใหม่
	var input entity.Mealplan
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ข้อมูลไม่ถูกต้อง"})
		return
	}

	// อัปเดตข้อมูล
	mealplan.PlanName = input.PlanName
	mealplan.AdminID = input.AdminID
	mealplan.DiseaseID = input.DiseaseID

	if err := db.Save(&mealplan).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "อัปเดตไม่สำเร็จ"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"mealplan": mealplan})
}

// DELETE /mealplans/:id
func DeleteMealplan(c *gin.Context) {
	id := c.Param("id")
	db := config.DB()

	if err := db.Delete(&entity.Mealplan{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ลบไม่สำเร็จ"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "ลบ Mealplan สำเร็จ"})
}
