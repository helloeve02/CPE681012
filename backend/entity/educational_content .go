package entity

import "gorm.io/gorm"

type EducationalContent  struct {
	gorm.Model
	Title			string
	PictureIn 		string
	PictureOut 		string
	Link			string
	Description		string

	AdminID		uint
	Admin		Admin
	
	EducationalGroupID uint
	EducationalGroup EducationalGroup `gorm:"foreignKey:EducationalGroupID"`

	ContentCategoryID uint
	ContentCategory ContentCategory `gorm:"foreignKey:ContentCategoryID"`
}