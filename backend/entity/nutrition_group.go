package entity

import "gorm.io/gorm"

type NutritionGroup struct {
	gorm.Model
	Name string
}