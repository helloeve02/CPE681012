package entity

import "gorm.io/gorm"

type PortionReccomentation struct {
	gorm.Model
	Amount float32 

	// FoodGroupID ทำหน้าที่เป็น FK
	FoodGroupID uint
	FoodGroup FoodGroup `gorm:"foreignKey:FoodGroupID"`

	// MealTimeID ทำหน้าที่เป็น FK
	MealTimeID uint
	MealTime MealTime `gorm:"foreignKey:MealTimeID"`

	// RuleID ทำหน้าที่เป็น FK
	RuleID uint
	Rule Rule `gorm:"foreignKey:RuleID"`
	
}