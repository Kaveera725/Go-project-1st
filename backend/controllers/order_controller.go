package controllers

import (
	"net/http"

	"hotel-menu-api/config"
	"hotel-menu-api/models"

	"github.com/gin-gonic/gin"
)

// CreateOrder places a new order for the authenticated customer
func CreateOrder(c *gin.Context) {
	userID, _ := c.Get("user_id")

	var input models.OrderInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Begin transaction
	tx, err := config.DB.Begin()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to start transaction"})
		return
	}
	defer tx.Rollback()

	// Calculate total and validate food items
	var totalAmount float64
	type resolvedItem struct {
		FoodID   string
		FoodName string
		Price    float64
		Quantity int
	}
	var items []resolvedItem

	for _, item := range input.Items {
		var foodName string
		var price float64
		var available bool

		err := tx.QueryRow(
			`SELECT name, price, available FROM foods WHERE id = $1`, item.FoodID,
		).Scan(&foodName, &price, &available)

		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Food item not found: " + item.FoodID})
			return
		}

		if !available {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Food item is not available: " + foodName})
			return
		}

		totalAmount += price * float64(item.Quantity)
		items = append(items, resolvedItem{
			FoodID:   item.FoodID,
			FoodName: foodName,
			Price:    price,
			Quantity: item.Quantity,
		})
	}

	// Create order
	var order models.Order
	err = tx.QueryRow(
		`INSERT INTO orders (user_id, total_amount, status)
		 VALUES ($1, $2, 'pending')
		 RETURNING id, user_id, total_amount, status, created_at`,
		userID, totalAmount,
	).Scan(&order.ID, &order.UserID, &order.TotalAmount, &order.Status, &order.CreatedAt)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create order"})
		return
	}

	// Insert order items
	for _, item := range items {
		_, err = tx.Exec(
			`INSERT INTO order_items (order_id, food_id, food_name, price, quantity)
			 VALUES ($1, $2, $3, $4, $5)`,
			order.ID, item.FoodID, item.FoodName, item.Price, item.Quantity,
		)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add order item"})
			return
		}
	}

	if err := tx.Commit(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to commit order"})
		return
	}

	// Populate items for response
	order.Items = make([]models.OrderItem, len(items))
	for i, item := range items {
		order.Items[i] = models.OrderItem{
			FoodID:   item.FoodID,
			FoodName: item.FoodName,
			Price:    item.Price,
			Quantity: item.Quantity,
		}
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Order placed successfully!", "data": order})
}

// GetMyOrders returns orders for the authenticated user
func GetMyOrders(c *gin.Context) {
	userID, _ := c.Get("user_id")

	rows, err := config.DB.Query(
		`SELECT id, user_id, total_amount, status, created_at
		 FROM orders WHERE user_id = $1 ORDER BY created_at DESC`, userID,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch orders"})
		return
	}
	defer rows.Close()

	var orders []models.Order
	for rows.Next() {
		var o models.Order
		if err := rows.Scan(&o.ID, &o.UserID, &o.TotalAmount, &o.Status, &o.CreatedAt); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to scan order"})
			return
		}

		// Fetch order items
		itemRows, err := config.DB.Query(
			`SELECT id, order_id, food_id, food_name, price, quantity
			 FROM order_items WHERE order_id = $1`, o.ID,
		)
		if err == nil {
			for itemRows.Next() {
				var item models.OrderItem
				itemRows.Scan(&item.ID, &item.OrderID, &item.FoodID, &item.FoodName, &item.Price, &item.Quantity)
				o.Items = append(o.Items, item)
			}
			itemRows.Close()
		}

		orders = append(orders, o)
	}

	c.JSON(http.StatusOK, gin.H{"data": orders})
}

// GetAllOrders returns all orders (admin only)
func GetAllOrders(c *gin.Context) {
	rows, err := config.DB.Query(
		`SELECT o.id, o.user_id, u.username, o.total_amount, o.status, o.created_at
		 FROM orders o JOIN users u ON o.user_id = u.id
		 ORDER BY o.created_at DESC`,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch orders"})
		return
	}
	defer rows.Close()

	var orders []models.Order
	for rows.Next() {
		var o models.Order
		if err := rows.Scan(&o.ID, &o.UserID, &o.Username, &o.TotalAmount, &o.Status, &o.CreatedAt); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to scan order"})
			return
		}

		// Fetch order items
		itemRows, err := config.DB.Query(
			`SELECT id, order_id, food_id, food_name, price, quantity
			 FROM order_items WHERE order_id = $1`, o.ID,
		)
		if err == nil {
			for itemRows.Next() {
				var item models.OrderItem
				itemRows.Scan(&item.ID, &item.OrderID, &item.FoodID, &item.FoodName, &item.Price, &item.Quantity)
				o.Items = append(o.Items, item)
			}
			itemRows.Close()
		}

		orders = append(orders, o)
	}

	c.JSON(http.StatusOK, gin.H{"data": orders})
}
