package entity

import "gorm.io/gorm"

type EducationalContent  struct {
	gorm.Model
	Title			string
	Picture 		string
	Link			string
	Description		string

	AdminID		uint
	Admin		Admin
}