package entity

import (
	"gorm.io/gorm"
)

type Mealday struct {
	gorm.Model
	DayofWeek string

	// MealplanID ทำหน้าที่เป็น FK
	MealplanID uint
	Mealplan Mealplan `gorm:"foreignKey:MealplanID"`

	// 1 Mealday เป็นเจ้าของได้หลาย Meal
	Meals []Meal `gorm:"foreignKey:MealdayID"`

}