package entity

import "gorm.io/gorm"

type Menu struct {
	gorm.Model
	Title		string
	Description	string
	Region		string
	Image		string

	AdminID		uint
	Admin 	Admin

}