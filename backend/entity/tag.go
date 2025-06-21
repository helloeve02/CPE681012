package entity

import "gorm.io/gorm"

type Tag struct {
	gorm.Model
	Name		string

	Ingredients	[]Ingredients `gorm:"foreignKey:TagID"`

	DiseaseTag	[]DiseaseTag `gorm:"foreignKey:TagID"`
}