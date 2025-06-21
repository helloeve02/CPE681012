package entity

import "gorm.io/gorm"

type MenuImage struct {
	gorm.Model
	Image		string

	MenuID      uint 	 
	Menu      	Menu  
}