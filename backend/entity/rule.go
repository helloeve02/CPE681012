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

	// DiseaseID ทำหน้าที่เป็น FK
	DiseaseID uint
	Disease Disease `gorm:"foreignKey:DiseaseID"`

	// 1 Rule เป็นเจ้าของได้หลาย PortionReccomentation
	PortionReccomentations []PortionReccomentation `gorm:"foreignKey:RuleID"`

	// 1 Rule เป็นเจ้าของได้หลาย NutritionReccomentation
	NutritionReccomentations []NutritionReccomentation `gorm:"foreignKey:RuleID"`
}