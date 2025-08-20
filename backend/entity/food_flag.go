package entity

import (
	"gorm.io/gorm"
)

type FoodFlag struct {
	gorm.Model
	Flag string

	// FoodGroup ทำหน้าที่เป็น FK
	FoodGroupID uint
	FoodGroup FoodGroup `gorm:"foreignKey:FoodGroupID"`

	// 1 FoodFlag เป็นเจ้าของได้หลาย FoodItem
	FoodItems []FoodItem `gorm:"foreignKey:FoodFlagID"`

}