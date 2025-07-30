package entity

import "gorm.io/gorm"

type Tag struct {
	gorm.Model
	Name		string


	DiseaseTag	[]DiseaseTag `gorm:"foreignKey:TagID"`
}