package entity

import "gorm.io/gorm"

type NutritionReccomentation struct {
	gorm.Model
	Amount float32

	// NutritionID ทำหน้าที่เป็น FK
	NutritionID uint
	Nutrition FoodGroup `gorm:"foreignKey:NutritionID"`

	// RuleID ทำหน้าที่เป็น FK
	RuleID uint
	Rule Rule `gorm:"foreignKey:RuleID"`
}