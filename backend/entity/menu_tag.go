package entity

// import "gorm.io/gorm"

type MenuTag struct {
	// gorm.Model
    MenuID uint `gorm:"primaryKey"`
    TagID  uint `gorm:"primaryKey"`
}
