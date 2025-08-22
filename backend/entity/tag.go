package entity

import "gorm.io/gorm"

type Tag struct {
	gorm.Model
	Name		string

	// Menu    []Menu `gorm:"many2many:menu_tags"`
	DiseaseTag	[]DiseaseTag `gorm:"foreignKey:TagID"`
	Menus []Menu `gorm:"many2many:menu_tags"`
	
}