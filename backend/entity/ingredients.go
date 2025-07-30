package entity

import "gorm.io/gorm"

type Ingredients struct {
	gorm.Model
	Name		string
	Image		string
	Credit 		string

	AdminID		uint
	Admin		Admin
}