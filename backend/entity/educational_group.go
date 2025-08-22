package entity

import "gorm.io/gorm"

type EducationalGroup  struct {
	gorm.Model
	Name			string
	// 1 EducationalGroup เป็นเจ้าของได้หลาย EducationalContent
	EducationalContents []EducationalContent `gorm:"foreignKey:EducationalGroupID"`
}