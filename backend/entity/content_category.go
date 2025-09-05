package entity

import "gorm.io/gorm"

type ContentCategory  struct {
	gorm.Model
	Category			string
	// 1 ContentCategory เป็นเจ้าของได้หลาย EducationalContent
	EducationalContents []EducationalContent `gorm:"foreignKey:ContentCategoryID"`
}
// พวก บทความ คลิป อินโฟ