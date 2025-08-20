package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/helloeve02/CPE681012/config"
	"github.com/helloeve02/CPE681012/entity"
)

// แสดงข้อมูลทั้งหมด
func GetAllFoodItems(c *gin.Context) {
	var fooditems []entity.FoodItem

	db := config.DB()
	if err := db.Find(&fooditems).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถดึงข้อมูลรายการอาหารทั้งหมดได้"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"fooditems": fooditems})
}

// แสดงข้อมูลตาม ID
func GetFoodItemByID(c *gin.Context) {
	id := c.Param("id")

	var fooditem entity.FoodItem
	db := config.DB()
	if err := db.First(&fooditem, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "ไม่พบข้อมูลรายการอาหาร"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"fooditem": fooditem})
}

// เพิ่มข้อมูล
func CreateFoodItem(c *gin.Context) {
	var fooditem entity.FoodItem

	if err := c.ShouldBindJSON(&fooditem); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db := config.DB()
	if err := db.Create(&fooditem).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถเพิ่มข้อมูลรายการอาหารได้"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "เพิ่มข้อมูลรายการอาหารสำเร็จ", "fooditem": fooditem})
}

// แก้ไขข้อมูล
func UpdateFoodItem(c *gin.Context) {
	id := c.Param("id")

	var fooditem entity.FoodItem
	db := config.DB()
	if err := db.First(&fooditem, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "ไม่พบข้อมูลรายการอาหาร"})
		return
	}

	if err := c.ShouldBindJSON(&fooditem); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := db.Save(&fooditem).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถแก้ไขข้อมูลรายการอาหารได้"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "แก้ไขข้อมูลรายการอาหารสำเร็จ", "fooditem": fooditem})
}

// ลบข้อมูล
func DeleteFoodItem(c *gin.Context) {
	id := c.Param("id")

	db := config.DB()
	if tx := db.Delete(&entity.FoodItem{}, id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ไม่พบรายการอาหารที่ต้องการลบ"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "ลบข้อมูลรายการอาหารสำเร็จ"})
}
