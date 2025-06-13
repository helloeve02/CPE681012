package entity

import "gorm.io/gorm"

type Disease struct {
	gorm.Model
	Name			string
	DiseaseStage 	string
}