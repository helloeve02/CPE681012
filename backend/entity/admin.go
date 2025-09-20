package entity

import "gorm.io/gorm"

type Admin struct {
	gorm.Model
	FirstName string   `valid:"required~FirstName is required"`  
    LastName  string     `valid:"required~LastName is required"`
	UserName string `valid:"required~UserName is required"`
    Password string `json:"Password"`
	
	Menu	[]Menu `gorm:"foreignKey:AdminID"`
	EducationalContent	[]EducationalContent `gorm:"foreignKey:AdminID"`
	
	// 1 Admin เป็นเจ้าของได้หลาย Mealplan
	/* Mealplans []Mealplan `gorm:"foreignKey:AdminID"` */
}