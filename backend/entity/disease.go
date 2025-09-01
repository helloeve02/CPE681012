package entity

import "gorm.io/gorm"

type Disease struct {
	gorm.Model
	Name			string
	Stage 			string
	
	// 1 Disease เป็นเจ้าของได้หลาย Mealplan
	Mealplans []Mealplan `gorm:"foreignKey:DiseaseID"`

	// 1 Disease เป็นเจ้าของได้หลาย Rule
	Rules []Rule `gorm:"foreignKey:DiseaseID"`

	// 1 Disease เป็นเจ้าของได้หลาย FoodchoiceDisease
	FoodchoiceDiseases []FoodchoiceDisease `gorm:"foreignKey:DiseaseID"`
}