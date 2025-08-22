package entity

import (
	"gorm.io/gorm"
)

type FoodChoice struct {
	gorm.Model
	FoodName string

	// 1 FoodChoice เป็นเจ้าของได้หลาย FoodchoiceDisease
	FoodchoiceDiseases []FoodchoiceDisease `gorm:"foreignKey:FoodChoiceID"`


}