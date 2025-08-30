package controller

import (
	"net/http"
	"github.com/gin-gonic/gin"
	"github.com/helloeve02/CPE681012/config"
	"github.com/helloeve02/CPE681012/entity"
)

// GetAllFoodChoiceDiseases - ดึงคำแนะนำอาหารตามโรคทั้งหมด
func GetAllFoodChoiceDiseases(c *gin.Context) {
	var foodchoicediseases []entity.FoodchoiceDisease
	db := config.DB()

	if err := db.Preload("Disease").Preload("FoodChoice").Find(&foodchoicediseases).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถดึงข้อมูลคำแนะนำอาหารได้"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"foodchoicediseases": foodchoicediseases})
}

// GetFoodChoicesByDiseaseID - ดึงคำแนะนำอาหารตาม ID ของโรค
func GetFoodChoicesByDiseaseID(c *gin.Context) {
	diseaseID := c.Param("diseaseID")
	var foodchoicediseases []entity.FoodchoiceDisease
	db := config.DB()

	if err := db.Preload("Disease").
		Preload("FoodChoice").
		Where("disease_id = ?", diseaseID).
		Find(&foodchoicediseases).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถดึงข้อมูลคำแนะนำอาหารตามโรคได้"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": foodchoicediseases}) // เพิ่ม "data" wrapper
}

// GetFoodChoiceDiseaseByID - ดึงคำแนะนำอาหารตาม ID
func GetFoodChoiceDiseaseByID(c *gin.Context) {
	id := c.Param("id")
	var foodchoicedisease entity.FoodchoiceDisease
	db := config.DB()

	if err := db.Preload("Disease").
		Preload("FoodChoice").
		First(&foodchoicedisease, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "ไม่พบข้อมูลคำแนะนำอาหาร"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"foodchoicedisease": foodchoicedisease})
}

// CreateFoodChoiceDisease - เพิ่มคำแนะนำอาหารตามโรค
func CreateFoodChoiceDisease(c *gin.Context) {
	var foodchoicedisease entity.FoodchoiceDisease

	if err := c.ShouldBindJSON(&foodchoicedisease); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db := config.DB()
	if err := db.Create(&foodchoicedisease).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถเพิ่มคำแนะนำอาหารได้"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "เพิ่มคำแนะนำอาหารสำเร็จ", "foodchoicedisease": foodchoicedisease})
}

// UpdateFoodChoiceDisease - แก้ไขคำแนะนำอาหารตามโรค
func UpdateFoodChoiceDisease(c *gin.Context) {
	id := c.Param("id")
	var foodchoicedisease entity.FoodchoiceDisease
	db := config.DB()

	if err := db.First(&foodchoicedisease, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "ไม่พบข้อมูลคำแนะนำอาหาร"})
		return
	}

	if err := c.ShouldBindJSON(&foodchoicedisease); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := db.Save(&foodchoicedisease).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถแก้ไขคำแนะนำอาหารได้"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "แก้ไขคำแนะนำอาหารสำเร็จ", "foodchoicedisease": foodchoicedisease})
}

// DeleteFoodChoiceDisease - ลบคำแนะนำอาหารตามโรค
func DeleteFoodChoiceDisease(c *gin.Context) {
	id := c.Param("id")
	db := config.DB()

	if tx := db.Delete(&entity.FoodchoiceDisease{}, id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ไม่พบคำแนะนำอาหารที่ต้องการลบ"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "ลบคำแนะนำอาหารสำเร็จ"})
}