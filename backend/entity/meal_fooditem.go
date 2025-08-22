package entity

import (
	"gorm.io/gorm"
)

type MealFooditem struct {
	gorm.Model
	/* MenuType string */
	PortionText string

	// MealID ทำหน้าที่เป็น FK
	MealID uint
	Meal Meal `gorm:"foreignKey:MealID"`

	// FoodItem ทำหน้าที่เป็น FK
	FoodItemID uint
	FoodItem FoodItem `gorm:"foreignKey:FoodItemID"`

}