package entity

import (
	"gorm.io/gorm"
)

type FoodchoiceDisease struct {
	gorm.Model
	Description string

	// Diseaseทำหน้าที่เป็น FK
	DiseaseID uint
	Disease Disease `gorm:"foreignKey:DiseaseID"`

	// FoodChoice ทำหน้าที่เป็น FK
	FoodChoiceID uint
	FoodChoice FoodChoice `gorm:"foreignKey:FoodChoiceID"`

}