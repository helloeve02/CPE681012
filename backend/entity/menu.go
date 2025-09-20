package entity

import "gorm.io/gorm"

type Menu struct {
	gorm.Model
	Title		string `valid:"required~Title is required"`
	Description	string `valid:"required~Description is required"`
	Region		string `valid:"required~Region is required"`
	Image		string `valid:"required~Image is required,url~Image must be a valid URL"`
	Sodium 		float32 
	Credit 		string `valid:"required~Credit is required"`
	Potassium	string 
	AdminID		uint `valid:"required~AdminID is required" `
	Admin 	Admin `valid:"-"`

	// MenuImage	[]MenuImage `gorm:"foreignKey:MenuID"`
	MealMenus []MealMenu `gorm:"foreignKey:MenuID"`
	Tags     []Tag  `gorm:"many2many:menu_tags"`
	
}