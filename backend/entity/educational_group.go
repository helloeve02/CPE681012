package entity

import "gorm.io/gorm"

type EducationalGroup  struct {
	gorm.Model
	Name			string
}