package entity

import "gorm.io/gorm"

type Ingredients struct {
	gorm.Model
	Name		string

	TagID        uint 	 
	Tag      Tag  
	
	FiveFoodGroupsID	uint
	FiveFoodGroups	FiveFoodGroups
	
	AdminID		uint
	Admin		Admin
}