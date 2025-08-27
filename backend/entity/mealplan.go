package entity

import (
	"gorm.io/gorm"
)

type Mealplan struct {
	gorm.Model
	PlanName string

	/* // AdminID ทำหน้าที่เป็น FK
	AdminID uint
	Admin Admin `gorm:"foreignKey:AdminID"` */

	// DiseaseID ทำหน้าที่เป็น FK
	DiseaseID uint
	Disease Disease `gorm:"foreignKey:DiseaseID"`

	// 1 Mealplan เป็นเจ้าของได้หลาย Mealday
	Mealdays []Mealday `gorm:"foreignKey:MealplanID"`
}