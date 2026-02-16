package config

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	_ "github.com/lib/pq"
)

// DB is the global database connection pool
var DB *sql.DB

// ConnectDB initializes the PostgreSQL connection
func ConnectDB() {
	host := getEnv("DB_HOST", "localhost")
	port := getEnv("DB_PORT", "5432")
	user := getEnv("DB_USER", "anushad")
	password := getEnv("DB_PASSWORD", "hotel_munu_pass")
	dbname := getEnv("DB_NAME", "hotel_menu")
	sslmode := getEnv("DB_SSLMODE", "disable")

	dsn := fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		host, port, user, password, dbname, sslmode,
	)

	var err error
	DB, err = sql.Open("postgres", dsn)
	if err != nil {
		log.Fatal("Failed to open database connection:", err)
	}

	// Verify connection
	if err = DB.Ping(); err != nil {
		log.Fatal("Failed to ping database:", err)
	}

	// Create table if not exists
	createTable()

	log.Println("✅ Connected to PostgreSQL database")
}

// createTable ensures the foods table exists
func createTable() {
	query := `
	CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

	CREATE TABLE IF NOT EXISTS foods (
		id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
		name       VARCHAR(255) NOT NULL,
		category   VARCHAR(100) NOT NULL DEFAULT 'Lunch',
		price      NUMERIC(10,2) NOT NULL DEFAULT 0.00,
		available  BOOLEAN NOT NULL DEFAULT true,
		created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
	);`

	if _, err := DB.Exec(query); err != nil {
		log.Fatal("Failed to create foods table:", err)
	}
}

func getEnv(key, fallback string) string {
	if val := os.Getenv(key); val != "" {
		return val
	}
	return fallback
}
