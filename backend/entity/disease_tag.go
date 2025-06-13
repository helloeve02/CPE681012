package entity

import "gorm.io/gorm"

type DiseaseTag struct {
	gorm.Model

	DiseaseID 	uint
	Disease		Disease

	TagID		uint
	Tag			Tag
}