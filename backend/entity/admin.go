package entity

import "gorm.io/gorm"

type Admin struct {
	gorm.Model
	FirstName string     
    LastName  string     
	UserName string `json:"UserName"`
    Password string `json:"Password"`
	
	Menu	[]Menu `gorm:"foreignKey:AdminID"`
	EducationalContent	[]EducationalContent `gorm:"foreignKey:AdminID"`
	Ingredients	[]Ingredients `gorm:"foreignKey:AdminID"`
	
	// 1 Admin เป็นเจ้าของได้หลาย Mealplan
	/* Mealplans []Mealplan `gorm:"foreignKey:AdminID"` */
}