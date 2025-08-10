package entity

import "gorm.io/gorm"

type Tag struct {
	gorm.Model
	Name		string

	Menu    []Menu `gorm:"many2many:menu_tag"`
	DiseaseTag	[]DiseaseTag `gorm:"foreignKey:TagID"`
}