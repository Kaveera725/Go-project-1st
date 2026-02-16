# 🏨 Hotel Menu Manager - Project Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Architecture](#architecture)
4. [Technology Stack](#technology-stack)
5. [Project Structure](#project-structure)
6. [Database Schema](#database-schema)
7. [API Documentation](#api-documentation)
8. [Frontend Components](#frontend-components)
9. [Environment Configuration](#environment-configuration)
10. [Docker Architecture](#docker-architecture)

---

## Project Overview

**Hotel Menu Manager** is a full-stack web application designed for hotels and restaurants to manage their food menu items efficiently. Built with modern technologies, it provides a clean interface for CRUD operations (Create, Read, Update, Delete) on menu items.

### Purpose
- Manage food items with details like name, category, price, and availability
- Provide real-time updates through a responsive React interface
- Support both development and production environments
- Enable easy deployment via Docker and Docker Compose

### Target Users
- Restaurant managers
- Hotel staff
- Food service administrators

---

## Features

### Core Functionality
✅ **CRUD Operations**
- Create new food items with name, category, price, and availability
- View all menu items in a sortable, filterable table
- Update existing items through an intuitive modal form
- Delete items with confirmation dialog

✅ **Category Management**
- Support for multiple categories: Breakfast, Lunch, Dinner, Drinks, Desserts
- Color-coded category badges for easy identification
- Filter and sort by category

✅ **Price Management**
- Display prices in formatted currency
- Support for decimal precision (up to 2 decimal places)
- Sort by price (ascending/descending)

✅ **Availability Tracking**
- Toggle item availability on/off
- Visual indicators (green checkmark / red X)
- Filter by available/unavailable items

### User Experience
- **Real-time feedback** with toast notifications for all actions
- **Responsive design** that works on desktop, tablet, and mobile
- **Form validation** to ensure data integrity
- **Confirmation dialogs** for destructive actions
- **Loading states** during API operations
- **Error handling** with user-friendly messages

---

## Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Client (Browser)                      │
│                      React + TypeScript + Vite                │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP/REST API
                         │ (Port 3000 → Nginx → Backend)
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    Nginx (Production Only)                    │
│              - Serves static React build                      │
│              - Proxies /api/* to backend:8080                 │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                      Go Backend (Gin)                         │
│              - REST API endpoints                             │
│              - CORS middleware                                │
│              - Business logic                                 │
│              - Database queries                               │
└────────────────────────┬────────────────────────────────────┘
                         │ PostgreSQL wire protocol
                         │ (Port 5432)
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   PostgreSQL Database                         │
│              - Stores food items                              │
│              - UUID primary keys                              │
│              - Auto-applied schema & seed data                │
└─────────────────────────────────────────────────────────────┘
```

### Development vs Production

| Component | Development | Production |
|-----------|-------------|------------|
| Frontend | Vite dev server (5173) | Nginx serving static build (80→3000) |
| Backend | Direct Go binary (8080) | Docker container (8080) |
| Database | Local PostgreSQL or Docker | Docker container (5432) |
| API URL | http://localhost:8080/api | http://EC2_IP:3000/api (proxied) |
| CORS | localhost:5173 | EC2 public IP |

---

## Technology Stack

### Backend
- **Language:** Go 1.21+
- **Framework:** Gin Web Framework
- **Database Driver:** lib/pq (PostgreSQL)
- **Middleware:** 
  - gin-contrib/cors (CORS handling)
  - Custom error handling
- **Environment:** godotenv for .env file support

### Frontend
- **Library:** React 18
- **Language:** TypeScript 5
- **Build Tool:** Vite 5
- **Styling:** Tailwind CSS 3
- **HTTP Client:** Axios
- **Icons:** Lucide React
- **Development:** Hot module replacement (HMR)

### Database
- **RDBMS:** PostgreSQL 16
- **Docker Image:** postgres:16-alpine
- **Features Used:**
  - UUID primary keys
  - NUMERIC for precise price storage
  - Timestamps with timezone
  - Boolean for availability

### DevOps
- **Containerization:** Docker & Docker Compose
- **Web Server:** Nginx (production)
- **CI/CD:** GitHub Actions
- **Deployment:** AWS EC2 (Ubuntu 24.04 LTS)
- **Runner:** Self-hosted GitHub Actions runner

---

## Project Structure

```
Go-project-1st/
├── .github/
│   └── workflows/
│       └── deploy.yml                    # CI/CD pipeline config
│
├── backend/
│   ├── config/
│   │   └── db.go                         # Database connection logic
│   ├── controllers/
│   │   └── food_controller.go            # CRUD handlers
│   ├── models/
│   │   └── food.go                       # Food struct definition
│   ├── routes/
│   │   └── food_routes.go                # Route registration
│   ├── main.go                           # Application entry point
│   ├── go.mod                            # Go dependencies
│   ├── go.sum                            # Go dependency checksums
│   ├── .env                              # Environment variables
│   └── Dockerfile                        # Multi-stage build config
│
├── database/
│   ├── schema.sql                        # Table creation DDL
│   └── seed.sql                          # Sample data DML
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── FoodList.tsx             # Main table view
│   │   │   ├── FoodFormModal.tsx        # Add/Edit form
│   │   │   ├── DeleteConfirmModal.tsx   # Delete confirmation
│   │   │   └── Toast.tsx                # Notification component
│   │   ├── services/
│   │   │   └── foodService.ts           # API client (Axios)
│   │   ├── types/
│   │   │   └── food.ts                  # TypeScript interfaces
│   │   ├── App.tsx                      # Root component
│   │   ├── main.tsx                     # React entry point
│   │   ├── index.css                    # Global styles + Tailwind
│   │   └── vite-env.d.ts                # Vite type declarations
│   ├── public/                          # Static assets
│   ├── index.html                       # HTML template
│   ├── package.json                     # Node dependencies
│   ├── vite.config.ts                   # Vite configuration
│   ├── tailwind.config.js               # Tailwind configuration
│   ├── tsconfig.json                    # TypeScript config
│   ├── nginx.conf                       # Dev nginx config
│   ├── nginx.prod.conf                  # Production nginx config
│   └── Dockerfile                       # Multi-stage build config
│
├── scripts/
│   ├── deploy.sh                        # EC2 deployment script
│   └── ec2-setup.sh                     # EC2 initial setup script
│
├── docker-compose.yml                   # Development compose file
├── docker-compose.prod.yml              # Production compose file
├── .env.example                         # Environment template
├── README.md                            # Quick start guide
├── PROJECT-DOCUMENTATION.md             # This file
├── COMPLETE-DEPLOYMENT-GUIDE.md         # Deployment instructions
├── EC2-DEPLOYMENT-STEPS.md              # AWS EC2 specific steps
├── QUICK-REFERENCE.md                   # Quick commands reference
└── DEPLOYMENT-CONFIG-GUIDE.md           # Configuration details
```

---

## Database Schema

### `foods` Table

```sql
CREATE TABLE IF NOT EXISTS foods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    available BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### Field Descriptions

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Auto-generated unique identifier |
| `name` | VARCHAR(255) | NOT NULL | Name of the food item (e.g., "Caesar Salad") |
| `category` | VARCHAR(50) | NOT NULL | Category: Breakfast, Lunch, Dinner, Drinks, Desserts |
| `price` | NUMERIC(10,2) | NOT NULL | Price in dollars (up to 99999999.99) |
| `available` | BOOLEAN | DEFAULT true | Whether item is currently available |
| `created_at` | TIMESTAMP | DEFAULT now() | Timestamp when record was created |

### Sample Data

```sql
INSERT INTO foods (name, category, price, available) VALUES
('Caesar Salad', 'Lunch', 8.99, true),
('Grilled Chicken', 'Dinner', 15.99, true),
('Pancakes', 'Breakfast', 6.99, true),
('Orange Juice', 'Drinks', 3.50, true),
('Chocolate Cake', 'Desserts', 5.99, false);
```

---

## API Documentation

### Base URL
- **Development:** `http://localhost:8080/api`
- **Production:** `http://YOUR_EC2_IP:3000/api` (proxied via Nginx)

### Endpoints

#### 1. Create Food Item
**POST** `/api/foods`

**Request Body:**
```json
{
  "name": "Caesar Salad",
  "category": "Lunch",
  "price": 8.99,
  "available": true
}
```

**Response:** `201 Created`
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Caesar Salad",
  "category": "Lunch",
  "price": 8.99,
  "available": true,
  "created_at": "2026-02-16T10:00:00Z"
}
```

#### 2. Get All Foods
**GET** `/api/foods`

**Response:** `200 OK`
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Caesar Salad",
    "category": "Lunch",
    "price": 8.99,
    "available": true,
    "created_at": "2026-02-16T10:00:00Z"
  }
]
```

#### 3. Get Food by ID
**GET** `/api/foods/:id`

**Response:** `200 OK`
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Caesar Salad",
  "category": "Lunch",
  "price": 8.99,
  "available": true,
  "created_at": "2026-02-16T10:00:00Z"
}
```

#### 4. Update Food Item
**PUT** `/api/foods/:id`

**Request Body:**
```json
{
  "name": "Caesar Salad Deluxe",
  "category": "Lunch",
  "price": 10.99,
  "available": true
}
```

**Response:** `200 OK`
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Caesar Salad Deluxe",
  "category": "Lunch",
  "price": 10.99,
  "available": true,
  "created_at": "2026-02-16T10:00:00Z"
}
```

#### 5. Delete Food Item
**DELETE** `/api/foods/:id`

**Response:** `204 No Content`

### Error Responses

**400 Bad Request** - Invalid input
```json
{
  "error": "Invalid request body"
}
```

**404 Not Found** - Resource not found
```json
{
  "error": "Food item not found"
}
```

**500 Internal Server Error** - Server error
```json
{
  "error": "Internal server error"
}
```

---

## Frontend Components

### Component Architecture

```
App.tsx
├── FoodList.tsx (Main component)
│   ├── FoodFormModal.tsx (Add/Edit modal)
│   ├── DeleteConfirmModal.tsx (Delete confirmation)
│   └── Toast.tsx (Notifications)
└── Services
    └── foodService.ts (API client)
```

### Component Details

#### 1. `App.tsx`
- Root component
- Provides global layout
- Imports and renders FoodList

#### 2. `FoodList.tsx`
**Purpose:** Main dashboard showing all food items in a table

**State Management:**
- `foods`: Array of food items
- `loading`: Loading state for API calls
- `showAddModal`: Control add/edit modal visibility
- `editingFood`: Track which food is being edited
- `showDeleteModal`: Control delete confirmation
- `deletingFood`: Track which food is being deleted
- `toast`: Notification state (message, type, visibility)

**Features:**
- Responsive table with column headers
- Category badges with color coding
- Price formatting ($XX.XX)
- Availability indicators (✓/✗)
- Action buttons (Edit/Delete)
- Add new item button

#### 3. `FoodFormModal.tsx`
**Purpose:** Modal form for creating and editing food items

**Props:**
```typescript
{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (food: Partial<Food>) => void;
  initialData?: Food;
}
```

**Features:**
- Form validation
- Controlled inputs for name, category, price, availability
- Category dropdown with predefined options
- Submit and cancel buttons
- Modal overlay with click-outside-to-close

#### 4. `DeleteConfirmModal.tsx`
**Purpose:** Confirmation dialog for delete operations

**Props:**
```typescript
{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
}
```

**Features:**
- Warning message with item name
- Confirm/Cancel buttons
- Red color scheme for destructive action

#### 5. `Toast.tsx`
**Purpose:** Toast notification for success/error messages

**Props:**
```typescript
{
  message: string;
  type: 'success' | 'error';
  isVisible: boolean;
  onClose: () => void;
}
```

**Features:**
- Auto-dismiss after 3 seconds
- Color coding (green for success, red for error)
- Icons (✓ for success, ✗ for error)
- Slide-in animation

#### 6. `foodService.ts`
**Purpose:** API client for all backend communication

**Functions:**
```typescript
- getAllFoods(): Promise<Food[]>
- getFoodById(id: string): Promise<Food>
- createFood(food: Partial<Food>): Promise<Food>
- updateFood(id: string, food: Partial<Food>): Promise<Food>
- deleteFood(id: string): Promise<void>
```

**Features:**
- Axios instance with base URL configuration
- TypeScript types for all responses
- Error handling
- Environment-based API URL

---

## Environment Configuration

### Backend `.env` (Development)
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=anushad
DB_PASSWORD=hotel_munu_pass
DB_NAME=hotel_menu
DB_SSLMODE=disable

# Server Configuration
SERVER_PORT=8080

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

### Backend `.env` (Production - EC2)
```env
# Database Configuration (Docker service name)
DB_HOST=db
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=hotel_menu
DB_SSLMODE=disable

# Server Configuration
SERVER_PORT=8080

# CORS Configuration (EC2 public IP)
ALLOWED_ORIGINS=http://65.2.35.4:3000

# Frontend Build Configuration
VITE_API_URL=/api
```

### Key Differences: Development vs Production

| Variable | Development | Production (Docker) |
|----------|-------------|---------------------|
| `DB_HOST` | `localhost` | `db` (service name) |
| `DB_USER` | Your local user | `postgres` |
| `ALLOWED_ORIGINS` | `localhost:5173` | EC2 public IP |
| `VITE_API_URL` | `http://localhost:8080/api` | `/api` (proxied) |

---

## Docker Architecture

### Multi-Stage Builds

#### Backend Dockerfile
```dockerfile
# Stage 1: Build
FROM golang:1.21-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o server .

# Stage 2: Runtime
FROM alpine:latest
WORKDIR /root/
COPY --from=builder /app/server .
EXPOSE 8080
CMD ["./server"]
```

**Benefits:**
- Small final image size (~15MB vs 300MB+)
- No build tools in production
- Security: minimal attack surface

#### Frontend Dockerfile
```dockerfile
# Stage 1: Build
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.prod.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Benefits:**
- Optimized React production build
- Nginx for efficient static file serving
- Reverse proxy for API requests

### Docker Compose Services

#### `docker-compose.prod.yml`
```yaml
services:
  db:
    image: postgres:16-alpine
    container_name: hotel_menu_db
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: hotel_menu
    volumes:
      - pgdata:/var/lib/postgresql/data
      - ./database/schema.sql:/docker-entrypoint-initdb.d/01-schema.sql
      - ./database/seed.sql:/docker-entrypoint-initdb.d/02-seed.sql
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build: ./backend
    container_name: hotel_menu_backend
    environment:
      DB_HOST: db
      DB_USER: postgres
      # ... other env vars
    depends_on:
      db:
        condition: service_healthy

  frontend:
    build:
      context: ./frontend
      args:
        - VITE_API_URL=/api
    container_name: hotel_menu_frontend
    depends_on:
      - backend
```

### Network Communication

```
┌──────────────────────────────────────────────────┐
│  Docker Network: go-project-1st_default          │
│                                                   │
│  ┌──────────┐      ┌──────────┐      ┌──────┐  │
│  │ Frontend │─────▶│ Backend  │─────▶│  DB  │  │
│  │  (Nginx) │      │   (Go)   │      │ (PG) │  │
│  │  :80     │      │  :8080   │      │:5432 │  │
│  └──────────┘      └──────────┘      └──────┘  │
│       ▲                                          │
│       │ Host Port Mapping                        │
└───────┼──────────────────────────────────────────┘
        │
   ┌────┴─────┐
   │  :3000   │ User Browser
   └──────────┘
```

- Frontend serves static files on internal port 80, mapped to host port 3000
- Frontend proxies `/api/*` requests to `backend:8080`
- Backend connects to `db:5432` using Docker service name
- All services communicate via internal Docker network
- Only ports 3000 (frontend) and optionally 8080 (backend) exposed to host

---

## Summary

This project demonstrates modern full-stack development practices:
- **Clean architecture** with separated concerns
- **Type safety** with Go and TypeScript
- **Containerization** for consistent environments
- **CI/CD ready** with GitHub Actions
- **Production-ready** with proper error handling and logging
- **Cost-effective** deployment on AWS EC2

For deployment instructions, see [COMPLETE-DEPLOYMENT-GUIDE.md](COMPLETE-DEPLOYMENT-GUIDE.md).
