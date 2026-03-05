-- ============================================
-- Hotel Menu Database Schema
-- ============================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the foods table
CREATE TABLE IF NOT EXISTS foods (
    id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name       VARCHAR(255) NOT NULL,
    category   VARCHAR(100) NOT NULL DEFAULT 'Lunch',
    price      NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    available  BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index on category for faster filtering
CREATE INDEX IF NOT EXISTS idx_foods_category ON foods(category);

-- Create the users table
CREATE TABLE IF NOT EXISTS users (
    id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username      VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role          VARCHAR(20) NOT NULL DEFAULT 'customer',
    created_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create the orders table
CREATE TABLE IF NOT EXISTS orders (
    id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id      UUID NOT NULL REFERENCES users(id),
    total_amount NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    status       VARCHAR(20) NOT NULL DEFAULT 'pending',
    created_at   TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create the order_items table
CREATE TABLE IF NOT EXISTS order_items (
    id        UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id  UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    food_id   UUID NOT NULL REFERENCES foods(id),
    food_name VARCHAR(255) NOT NULL,
    price     NUMERIC(10,2) NOT NULL,
    quantity  INTEGER NOT NULL DEFAULT 1
);
