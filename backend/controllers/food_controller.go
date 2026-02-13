package controllers

import (
	"database/sql"
	"net/http"

	"hotel-menu-api/config"
	"hotel-menu-api/models"

	"github.com/gin-gonic/gin"
)

// ---------- CREATE ----------

// CreateFood adds a new food item to the menu
func CreateFood(c *gin.Context) {
	var input models.FoodInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	available := true
	if input.Available != nil {
		available = *input.Available
	}

	var food models.Food
	err := config.DB.QueryRow(
		`INSERT INTO foods (name, category, price, available)
		 VALUES ($1, $2, $3, $4)
		 RETURNING id, name, category, price, available, created_at`,
		input.Name, input.Category, input.Price, available,
	).Scan(&food.ID, &food.Name, &food.Category, &food.Price, &food.Available, &food.CreatedAt)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create food item"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Food item created", "data": food})
}

// ---------- READ ALL ----------

// GetAllFoods returns every food item
func GetAllFoods(c *gin.Context) {
	rows, err := config.DB.Query(
		`SELECT id, name, category, price, available, created_at
		 FROM foods ORDER BY created_at DESC`,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch food items"})
		return
	}
	defer rows.Close()

	foods := []models.Food{}
	for rows.Next() {
		var f models.Food
		if err := rows.Scan(&f.ID, &f.Name, &f.Category, &f.Price, &f.Available, &f.CreatedAt); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to scan food item"})
			return
		}
		foods = append(foods, f)
	}

	c.JSON(http.StatusOK, gin.H{"data": foods})
}

// ---------- READ ONE ----------

// GetFoodByID returns a single food item
func GetFoodByID(c *gin.Context) {
	id := c.Param("id")

	var food models.Food
	err := config.DB.QueryRow(
		`SELECT id, name, category, price, available, created_at
		 FROM foods WHERE id = $1`, id,
	).Scan(&food.ID, &food.Name, &food.Category, &food.Price, &food.Available, &food.CreatedAt)

	if err == sql.ErrNoRows {
		c.JSON(http.StatusNotFound, gin.H{"error": "Food item not found"})
		return
	}
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch food item"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": food})
}

// ---------- UPDATE ----------

// UpdateFood modifies an existing food item
func UpdateFood(c *gin.Context) {
	id := c.Param("id")

	var input models.FoodInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	available := true
	if input.Available != nil {
		available = *input.Available
	}

	var food models.Food
	err := config.DB.QueryRow(
		`UPDATE foods
		 SET name = $1, category = $2, price = $3, available = $4
		 WHERE id = $5
		 RETURNING id, name, category, price, available, created_at`,
		input.Name, input.Category, input.Price, available, id,
	).Scan(&food.ID, &food.Name, &food.Category, &food.Price, &food.Available, &food.CreatedAt)

	if err == sql.ErrNoRows {
		c.JSON(http.StatusNotFound, gin.H{"error": "Food item not found"})
		return
	}
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update food item"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Food item updated", "data": food})
}

// ---------- DELETE ----------

// DeleteFood removes a food item
func DeleteFood(c *gin.Context) {
	id := c.Param("id")

	result, err := config.DB.Exec(`DELETE FROM foods WHERE id = $1`, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete food item"})
		return
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Food item not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Food item deleted"})
}
