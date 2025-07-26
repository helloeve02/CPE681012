package entity

import "gorm.io/gorm"

type FoodGroup struct {
	gorm.Model
	Name string
	Unit string

	// 1 FoodGroup เป็นเจ้าของได้หลาย PortionReccomentation
	PortionReccomentations []PortionReccomentation `gorm:"foreignKey:FoodGroupID"`

	// 1 FoodGroup เป็นเจ้าของได้หลาย NutritionReccomentation
	NutritionReccomentations []NutritionReccomentation `gorm:"foreignKey:FoodGroupID"`
}