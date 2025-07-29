package entity

import "gorm.io/gorm"

type MealTime struct {
	gorm.Model
	Name string

	// 1 MealTime เป็นเจ้าของได้หลาย PortionReccomentation
	PortionReccomentations []PortionReccomentation `gorm:"foreignKey:MealTimeID"`

}