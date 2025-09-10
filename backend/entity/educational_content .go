package entity

import "gorm.io/gorm"

type EducationalContent  struct {
	gorm.Model
	Title			string `valid:"required~Title is required"`
	PictureIn 		string /* `valid:"required~PictureIn is required,url~PictureIn must be a valid URL"` */
	PictureOut 		string /* `valid:"required~PictureOut is PictureOut,url~PictureOut must be a valid URL"` */
	Link			string /* `valid:"required~Link is required,url~Link must be a valid URL"` */
	Credit			string /* `valid:"required~Credit is required,url~Credit must be a valid URL"` */
	Description		string `valid:"required~Description is required"`

	AdminID		uint
	Admin		Admin
	
	EducationalGroupID uint `valid:"required~EducationalGroupID is required"`
	EducationalGroup EducationalGroup `gorm:"foreignKey:EducationalGroupID" valid:"-"`

	ContentCategoryID uint `valid:"required~ContentCategoryID is required"`
	ContentCategory ContentCategory `gorm:"foreignKey:ContentCategoryID" valid:"-"`
}