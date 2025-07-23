package entity

import "gorm.io/gorm"

type Rule struct {
	gorm.Model

	Calories uint

	// IbwRangeID ทำหน้าที่เป็น FK
	IbwRangeID uint
	IbwRange IbwRange `gorm:"foreignKey:IbwRangeID"`

	// AgeRangeID ทำหน้าที่เป็น FK
	AgeRangeID uint
	AgeRange AgeRange `gorm:"foreignKey:AgeRangeID"`

	// StageID ทำหน้าที่เป็น FK
	StageID uint
	Stage Stage `gorm:"foreignKey:StageID"`

	// 1 Rule เป็นเจ้าของได้หลาย PortionReccomentation
	PortionReccomentations []PortionReccomentation `gorm:"foreignKey:RuleID"`

	// 1 Rule เป็นเจ้าของได้หลาย NutritionReccomentation
	NutritionReccomentations []NutritionReccomentation `gorm:"foreignKey:RuleID"`
}