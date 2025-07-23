package entity

import "gorm.io/gorm"

type Stage struct {
	gorm.Model
	Stage string

	// DiseaseID ทำหน้าที่เป็น FK
	DiseaseID uint
	Disease Disease `gorm:"foreignKey:DiseaseID"`

	// 1 Stage เป็นเจ้าของได้หลาย rule
	Rules []Rule `gorm:"foreignKey:StageID"`
}