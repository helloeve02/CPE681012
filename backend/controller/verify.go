package controller

import (
	"fmt"
	"math/rand"
	"net/http"
	"net/smtp"
	"os"
	"sync"

	"github.com/gin-gonic/gin"
)

type OTPRequest struct {
	Email string `json:"email"`
}

type VerifyRequest struct {
	Email string `json:"email"`
	OTP   string `json:"otp"`
}

var otpStore = struct {
	sync.Mutex
	data map[string]string
}{data: make(map[string]string)}

func SendOTP(c *gin.Context) {
	var req OTPRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	otp := fmt.Sprintf("%06d", rand.Intn(1000000))

	otpStore.Lock()
	otpStore.data[req.Email] = otp
	otpStore.Unlock()

	// ✅ อ่านค่าจาก Environment Variable
	from := os.Getenv("SMTP_EMAIL")
	password := os.Getenv("SMTP_PASSWORD")
	smtpHost := os.Getenv("SMTP_HOST") // เช่น smtp.gmail.com
	smtpPort := os.Getenv("SMTP_PORT") // เช่น 587

	if from == "" || password == "" || smtpHost == "" || smtpPort == "" {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "SMTP config is missing. Please set SMTP_EMAIL, SMTP_PASSWORD, SMTP_HOST, SMTP_PORT",
		})
		return
	}

	to := []string{req.Email}
	msg := []byte("To: " + req.Email + "\r\n" +
		"Subject: รหัสยืนยันการรีเซ็ตรหัสผ่าน\r\n" +
		"\r\n" +
		"รหัส OTP ของคุณคือ: " + otp + "\r\n")

	auth := smtp.PlainAuth("", from, password, smtpHost)

	// auth := smtp.PlainAuth("", from, password, smtpHost)

	// ✅ Debug print
	fmt.Println("DEBUG SMTP:", from, smtpHost, smtpPort, "len(password) =", len(password))

	err := smtp.SendMail(smtpHost+":"+smtpPort, auth, from, to, msg)
	if err != nil {
		fmt.Println("❌ SendMail error:", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":  "ไม่สามารถส่งอีเมลได้",
			"detail": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "message": "OTP sent to email"})
}

func VerifyOTP(c *gin.Context) {
	var req VerifyRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	otpStore.Lock()
	storedOtp, exists := otpStore.data[req.Email]
	otpStore.Unlock()

	if !exists || storedOtp != req.OTP {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "OTP ไม่ถูกต้อง"})
		return
	}

	otpStore.Lock()
	delete(otpStore.data, req.Email)
	otpStore.Unlock()

	c.JSON(http.StatusOK, gin.H{"success": true, "message": "OTP verified, now you can reset password"})
}
