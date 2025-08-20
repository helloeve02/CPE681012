package controller

import (
	"net/http"
	"github.com/helloeve02/CPE681012/entity"
	"github.com/helloeve02/CPE681012/config"
	"github.com/gin-gonic/gin"
	"errors"  // เพิ่ม import สำหรับ package errors
	"gorm.io/gorm" // เพิ่ม import สำหรับ gorm
	"github.com/helloeve02/CPE681012/services"
	"golang.org/x/crypto/bcrypt"
)
type (
	Authen struct {
		UserName string
		Password string
	}

	signUp struct {
		UserName string
		Email    string
		Password string
	}

	ResetPassword struct {
		UserName string
		Email    string
		Password string
	}

	ChangePassword struct {
		UserID  uint
		Password string
		NewPassword string
	}
)
// POST /users
func CreateUser(c *gin.Context) {
	var user entity.Admin

	// bind เข้าตัวแปร user
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db := config.DB()


	// เข้ารหัสลับรหัสผ่านที่ผู้ใช้กรอกก่อนบันทึกลงฐานข้อมูล
	hashedPassword, _ := config.HashPassword(user.Password)

	// สร้าง User
	u := entity.Admin{
		UserName:  user.UserName,  
		Password:  hashedPassword,     
		FirstName:  "ไม่ได้ระบุ",
		LastName:  "ไม่ได้ระบุ",
	}

	// บันทึก
	if err := db.Create(&u).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Created success", "data": u})
}


// GET /user/:id
func GetUserByID(c *gin.Context) {
    ID := c.Param("id")
	var user entity.Admin

    db := config.DB() // Assuming you have a function to get the DB connection

    // Query the user by ID
    results := db.Where("id = ?", ID).First(&user)
    if results.Error != nil {
        if errors.Is(results.Error, gorm.ErrRecordNotFound) {
            c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
        } else {
            c.JSON(http.StatusInternalServerError, gin.H{"error": results.Error.Error()})
        }
        return
    }

    // Return the user data as JSON
    c.JSON(http.StatusOK, user)
}

// GET /users
func ListUsers(c *gin.Context) {

	// Define a slice to hold user records
	var users []entity.Admin

	// Get the database connection
	db := config.DB()

	// Query the user table for basic user data
	results := db.Select("id, user_name, password, first_name, last_name ").Find(&users)

	// Check for errors in the query
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}

	// Return the results as JSON
	c.JSON(http.StatusOK, users)
}


// DELETE /users/:id
func DeleteUser(c *gin.Context) {

	id := c.Param("id")
	db := config.DB()
	if tx := db.Exec("DELETE FROM admins WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Deleted successful"})

}

// PATCH /users
func UpdateUser(c *gin.Context) {
	var user entity.Admin

	UserID := c.Param("id")

	db := config.DB()
	result := db.First(&user, UserID)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
		return
	}

	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
		return
	}

	result = db.Save(&user)
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Updated successful"})
}

// PUT update user ใช้อันนี้นะจ๊ะ
func UpdateUserByid(c *gin.Context) {


	var user entity.Admin
 
 
	UserID := c.Param("id")
 
 
	db := config.DB()
 
	result := db.First(&user, UserID)
 
	if result.Error != nil {
 
		c.JSON(http.StatusNotFound, gin.H{"error": "NameUser not found"})
 
		return
 
	}
 
 
	if err := c.ShouldBindJSON(&user); err != nil {
 
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
 
		return
 
	}
 
 
	result = db.Save(&user)
 
	if result.Error != nil {
 
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})
 
		return
 
	}
 
 
	c.JSON(http.StatusOK, gin.H{"message": "Updated successful"})
 
 }

 func SignIn(c *gin.Context) {
    var payload Authen
    var user entity.Admin

    if err := c.ShouldBindJSON(&payload); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    // ค้นหา user ด้วย Username ที่กรอก
    if err := config.DB().Where("user_name = ?", payload.UserName).First(&user).Error; err != nil {
        if errors.Is(err, gorm.ErrRecordNotFound) {
            c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
        } else {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Database query error"})
        }
        return
    }

    // ตรวจสอบรหัสผ่าน
    err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(payload.Password))
    if err != nil {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "Password is incorrect"})
        return
    }

    // สร้าง JWT Token
    jwtWrapper := services.JwtWrapper{
        SecretKey:       "SvNQpBN8y3qlVrsGAYYWoJJk56LtzFHx",
        Issuer:          "AuthService",
        ExpirationHours: 24,
    }

    signedToken, err := jwtWrapper.GenerateToken(user.UserName)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Error signing token"})
        return
    }

    c.JSON(http.StatusOK, gin.H{
        "token_type": "Bearer",
        "token":      signedToken,
        "id":         user.ID,
    })
}