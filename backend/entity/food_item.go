package entity

import "gorm.io/gorm"

type FoodItem struct {
	gorm.Model
	Name string
	Image string
	Credit string
	Description string

	// FoodFlag ทำหน้าที่เป็น FK
	FoodFlagID uint
	FoodFlag FoodFlag `gorm:"foreignKey:FoodFlagID"`
}