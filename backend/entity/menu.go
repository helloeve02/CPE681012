package entity

import "gorm.io/gorm"

type Menu struct {
	gorm.Model
	Title		string
	Description	string
	Region		string
	Image		string
	Sodium 		float32
	Credit 		string
	Potassium	string
	AdminID		uint
	Admin 	Admin

	// MenuImage	[]MenuImage `gorm:"foreignKey:MenuID"`
	MealMenus []MealMenu `gorm:"foreignKey:MenuID"`
	Tags     []Tag  `gorm:"many2many:menu_tags"`
	
}