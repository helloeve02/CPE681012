package entity

import (
	"gorm.io/gorm"
)

type FoodExchange struct {
	gorm.Model
	Amount string
	Unit string

	// FoodItem ทำหน้าที่เป็น FK
	FoodItemID uint
	FoodItem FoodItem `gorm:"foreignKey:FoodItemID"`
}
