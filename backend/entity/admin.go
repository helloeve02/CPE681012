package entity

import "gorm.io/gorm"

type Admin struct {
	gorm.Model
	Name		string

	Menu	[]Menu `gorm:"foreignKey:AdminID"`
	EducationalContent	[]EducationalContent `gorm:"foreignKey:AdminID"`
	Ingredients	[]Ingredients `gorm:"foreignKey:AdminID"`
}