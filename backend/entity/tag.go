package entity

import "gorm.io/gorm"

type Tag struct {
	gorm.Model
	Name		string
	Menus []Menu `gorm:"many2many:menu_tags"`
	
}