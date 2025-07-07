package entity

import (
	"gorm.io/gorm"
)

type Meal struct {
	gorm.Model
	MealType string

	// MealdayID ทำหน้าที่เป็น FK
	MealdayID uint
	Mealday Mealday `gorm:"foreignKey:MealdayID"`

	// 1 Meal เป็นเจ้าของได้หลาย MealMenu
	MealMenus []MealMenu `gorm:"foreignKey:MealID"`

}