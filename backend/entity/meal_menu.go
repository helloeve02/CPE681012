package entity

import (
	"gorm.io/gorm"
)

type MealMenu struct {
	gorm.Model
	MenuType string
	PortionText string

	// MealID ทำหน้าที่เป็น FK
	MealID uint
	Meal Meal `gorm:"foreignKey:MealID"`

	// Menu ทำหน้าที่เป็น FK
	MenuID uint
	Menu Menu `gorm:"foreignKey:MenuID"`

}