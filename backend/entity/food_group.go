package entity

import "gorm.io/gorm"

type FoodGroup struct {
	gorm.Model
	Name string
	Unit string

	// 1 FoodGroup เป็นเจ้าของได้หลาย PortionReccomentation
	PortionReccomentations []PortionRecommendation `gorm:"foreignKey:FoodGroupID"`

	// 1 FoodGroup เป็นเจ้าของได้หลาย FoodFlag
	FoodFlags []FoodFlag `gorm:"foreignKey:FoodGroupID"`
}