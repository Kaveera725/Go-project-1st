package models

import "time"

// Order represents a customer order
type Order struct {
	ID          string      `json:"id"`
	UserID      string      `json:"user_id"`
	Username    string      `json:"username,omitempty"`
	TotalAmount float64     `json:"total_amount"`
	Status      string      `json:"status"`
	CreatedAt   time.Time   `json:"created_at"`
	Items       []OrderItem `json:"items,omitempty"`
}

// OrderItem represents a single item in an order
type OrderItem struct {
	ID       string  `json:"id"`
	OrderID  string  `json:"order_id"`
	FoodID   string  `json:"food_id"`
	FoodName string  `json:"food_name"`
	Price    float64 `json:"price"`
	Quantity int     `json:"quantity"`
}

// OrderInput is used when customer places an order
type OrderInput struct {
	Items []OrderItemInput `json:"items" binding:"required,min=1"`
}

// OrderItemInput represents one item in the order request
type OrderItemInput struct {
	FoodID   string `json:"food_id"   binding:"required"`
	Quantity int    `json:"quantity"   binding:"required,min=1"`
}
