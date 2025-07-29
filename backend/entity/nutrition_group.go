package entity

import "gorm.io/gorm"

type NutritionGroup struct {
	gorm.Model
	Name string

	// 1 NutritionGroup เป็นเจ้าของได้หลาย NutritionReccomentation
	NutritionReccomentations []NutritionReccomentation `gorm:"foreignKey:NutritionID"`
}