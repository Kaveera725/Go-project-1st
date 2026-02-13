package main

import (
	"log"
	"os"
	"strings"

	"hotel-menu-api/config"
	"hotel-menu-api/routes"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// Load .env file
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using system environment variables")
	}

	// Connect to database
	config.ConnectDB()
	defer config.DB.Close()

	// Create Gin router
	router := gin.Default()

	// CORS configuration — allow React frontend
	allowedOrigins := getEnvOrDefault("ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:3000")
	origins := strings.Split(allowedOrigins, ",")
	
	router.Use(cors.New(cors.Config{
		AllowOrigins:     origins,
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		AllowCredentials: true,
	}))

	// Register routes
	routes.RegisterFoodRoutes(router)

	// Start server
	port := os.Getenv("SERVER_PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("🚀 Server running on http://localhost:%s", port)
	if err := router.Run(":" + port); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}

func getEnvOrDefault(key, fallback string) string {
	if val := os.Getenv(key); val != "" {
		return val
	}
	return fallback
}
