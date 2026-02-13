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
