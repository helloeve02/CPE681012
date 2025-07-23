package entity

import "gorm.io/gorm"

type AgeRange struct {
	gorm.Model
	AgeMin uint
	AgeMax uint

	// 1 AgeRange เป็นเจ้าของได้หลาย rule
	Rules []Rule `gorm:"foreignKey:AgeRangeID"`
}