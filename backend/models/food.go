package models

import "time"

// Food represents a menu item in the hotel
type Food struct {
	ID        string    `json:"id"`
	Name      string    `json:"name"      binding:"required"`
	Category  string    `json:"category"  binding:"required"`
	Price     float64   `json:"price"     binding:"required,gt=0"`
	Available bool      `json:"available"`
	CreatedAt time.Time `json:"created_at"`
}

// FoodInput is used for creating / updating a food item (no ID or timestamp)
type FoodInput struct {
	Name      string  `json:"name"      binding:"required"`
	Category  string  `json:"category"  binding:"required"`
	Price     float64 `json:"price"     binding:"required,gt=0"`
	Available *bool   `json:"available"` // pointer so we can detect explicit false
}
