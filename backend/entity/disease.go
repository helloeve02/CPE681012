package entity

import "gorm.io/gorm"

type Disease struct {
	gorm.Model
	Name			string
	DiseaseStage 	string

	DiseaseTag	[]DiseaseTag `gorm:"foreignKey:DiseaseID"`
	
	// 1 Disease เป็นเจ้าของได้หลาย Mealplan
	Mealplans []Mealplan `gorm:"foreignKey:DiseaseID"`
}