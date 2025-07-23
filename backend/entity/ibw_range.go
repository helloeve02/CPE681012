package entity

import "gorm.io/gorm"

type IbwRange struct {
	gorm.Model
	IbwMin uint
	IbwMax	uint

	// 1 IbwRange เป็นเจ้าของได้หลาย rule
	Rules []Rule `gorm:"foreignKey:IbwRangeID"`
}