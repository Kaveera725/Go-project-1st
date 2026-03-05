package models

import "time"

// User represents an application user (admin or customer)
type User struct {
	ID           string    `json:"id"`
	Username     string    `json:"username"     binding:"required"`
	PasswordHash string    `json:"-"` // never expose
	Role         string    `json:"role"`
	CreatedAt    time.Time `json:"created_at"`
}

// LoginInput is used for login requests
type LoginInput struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

// RegisterInput is used for registration requests
type RegisterInput struct {
	Username string `json:"username" binding:"required,min=3,max=50"`
	Password string `json:"password" binding:"required,min=4"`
	Role     string `json:"role"` // defaults to "customer"
}
