package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/helloeve02/CPE681012/config"
	"github.com/helloeve02/CPE681012/entity"
)

// GetAllFoodChoices - ดึงข้อมูลตัวเลือกอาหารทั้งหมด
func GetAllFoodChoices(c *gin.Context) {
	var foodchoices []entity.FoodChoice
	db := config.DB()

	if err := db.Find(&foodchoices).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถดึงข้อมูลตัวเลือกอาหารได้"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"foodchoices": foodchoices})
}

// GetFoodChoiceByID - ดึงข้อมูลตัวเลือกอาหารตาม ID
func GetFoodChoiceByID(c *gin.Context) {
	id := c.Param("id")
	var foodchoice entity.FoodChoice
	db := config.DB()

	if err := db.First(&foodchoice, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "ไม่พบข้อมูลตัวเลือกอาหาร"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"foodchoice": foodchoice})
}

/* func GetFoodChoicesByDisease(c *gin.Context) {
	diseaseID := c.Param("diseaseID")
	var foodchoices []entity.FoodChoice
	db := config.DB()
	if err := db.Joins("JOIN foodchoice_diseases fcd ON fcd.food_choice_id = food_choices.id").
		Where("fcd.disease_id = ?", diseaseID).
		Find(&foodchoices).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถดึงข้อมูลได้"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"foodchoices": foodchoices})
} */ //ไปใช้GetFoodChoicesByDiseaseID (ตารางกลาง)

// CreateFoodChoice - เพิ่มข้อมูลตัวเลือกอาหาร
func CreateFoodChoice(c *gin.Context) {
	var foodchoice entity.FoodChoice

	if err := c.ShouldBindJSON(&foodchoice); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db := config.DB()
	if err := db.Create(&foodchoice).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถเพิ่มข้อมูลตัวเลือกอาหารได้"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "เพิ่มข้อมูลตัวเลือกอาหารสำเร็จ", "foodchoice": foodchoice})
}

// UpdateFoodChoice - แก้ไขข้อมูลตัวเลือกอาหาร
func UpdateFoodChoice(c *gin.Context) {
	id := c.Param("id")
	var foodchoice entity.FoodChoice
	db := config.DB()

	if err := db.First(&foodchoice, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "ไม่พบข้อมูลตัวเลือกอาหาร"})
		return
	}

	if err := c.ShouldBindJSON(&foodchoice); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := db.Save(&foodchoice).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถแก้ไขข้อมูลตัวเลือกอาหารได้"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "แก้ไขข้อมูลตัวเลือกอาหารสำเร็จ", "foodchoice": foodchoice})
}

// DeleteFoodChoice - ลบข้อมูลตัวเลือกอาหาร
func DeleteFoodChoice(c *gin.Context) {
	id := c.Param("id")
	db := config.DB()

	if tx := db.Delete(&entity.FoodChoice{}, id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ไม่พบตัวเลือกอาหารที่ต้องการลบ"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "ลบข้อมูลตัวเลือกอาหารสำเร็จ"})
}