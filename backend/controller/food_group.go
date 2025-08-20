package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/helloeve02/CPE681012/config"
	"github.com/helloeve02/CPE681012/entity"
)

// แสดงข้อมูลทั้งหมด
func GetAllFoodGroups(c *gin.Context) {
	var foodgroups []entity.FoodGroup

	db := config.DB()
	if err := db.Find(&foodgroups).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถดึงข้อมูลเมนูอาหารแนะนำทั้งหมดได้"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"foodgroups": foodgroups})
}

// แสดงข้อมูลตาม ID
func GetFoodGroupByID(c *gin.Context) {
	id := c.Param("id")

	var foodgroup entity.FoodGroup
	db := config.DB()
	if err := db.First(&foodgroup, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "ไม่พบข้อมูลเมนูอาหารแนะนำ"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"foodgroup": foodgroup})
}

// เพิ่มข้อมูล
func CreateFoodGroup(c *gin.Context) {
	var foodgroup entity.FoodGroup

	if err := c.ShouldBindJSON(&foodgroup); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db := config.DB()
	if err := db.Create(&foodgroup).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถเพิ่มข้อมูลเมนูอาหารแนะนำได้"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "เพิ่มข้อมูลเมนูอาหารแนะนำสำเร็จ", "foodgroup": foodgroup})
}

// แก้ไขข้อมูล
func UpdateFoodGroup(c *gin.Context) {
	id := c.Param("id")

	var foodgroup entity.FoodGroup
	db := config.DB()
	if err := db.First(&foodgroup, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "ไม่พบข้อมูลเมนูอาหารแนะนำ"})
		return
	}

	if err := c.ShouldBindJSON(&foodgroup); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := db.Save(&foodgroup).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถแก้ไขข้อมูลเมนูอาหารแนะนำได้"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "แก้ไขข้อมูลรายการเมนูอาหารแนะนำสำเร็จ", "foodgroup": foodgroup})
}

// ลบข้อมูล
func DeleteFoodGroup(c *gin.Context) {
	id := c.Param("id")

	db := config.DB()
	if tx := db.Delete(&entity.FoodGroup{}, id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ไม่พบเมนูอาหารแนะนำที่ต้องการลบ"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "ลบข้อมูลเมนูอาหารแนะนำสำเร็จ"})
}
