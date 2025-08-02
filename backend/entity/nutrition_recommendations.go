package entity

import "gorm.io/gorm"

type NutritionRecommendation struct {
	gorm.Model
	AmountInGrams float32
	AmountInPercentage float32

	// NutritionGroupID ทำหน้าที่เป็น FK
	NutritionGroupID uint
	NutritionGroup NutritionGroup `gorm:"foreignKey:NutritionGroupID"`

	// RuleID ทำหน้าที่เป็น FK
	RuleID uint
	Rule Rule `gorm:"foreignKey:RuleID"`
}