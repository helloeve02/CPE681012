package entity

import "gorm.io/gorm"

type Ingredients struct {
	gorm.Model
	Name		string
	Phosphorus	float32
	Calories	float32
	Water		float32
	Sodium		float32
	Protein		float32
	Potassium		float32

	TagID        uint 	 
	Tag      Tag  
	
	FiveFoodGroupsID	uint
	FiveFoodGroups	FiveFoodGroups
	
}