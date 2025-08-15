package entity

import "gorm.io/gorm"

type Menu struct {
	gorm.Model
	Title		string
	Description	string
	Region		string
	Image		string
	Credit 		string
	AdminID		uint
	Admin 	Admin

	// MenuImage	[]MenuImage `gorm:"foreignKey:MenuID"`
	MealMenus []MealMenu `gorm:"foreignKey:MenuID"`
	Tag     []Tag  `gorm:"many2many:menu_tag"`
}