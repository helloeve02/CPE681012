package entity

import "gorm.io/gorm"

type FoodItem struct {
	gorm.Model
	Name string `valid:"required~Name is required"`
	Image string/*  `valid:"required~Image is required,url~Image must be a valid URL"` */
	Credit string /* `valid:"required~Credit is required,url~Credit must be a valid URL"` */
	Description string /* `valid:"required~Description is required"` */

	// FoodFlag ทำหน้าที่เป็น FK
	FoodFlagID uint `valid:"required~FoodFlagID is required"`
	FoodFlag FoodFlag `gorm:"foreignKey:FoodFlagID" valid:"-"`

	FoodExchange *FoodExchange `valid:"-"` 
}