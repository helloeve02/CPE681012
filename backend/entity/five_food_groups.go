package entity

import "gorm.io/gorm"

type FiveFoodGroups struct {
	gorm.Model
	Name		string
}