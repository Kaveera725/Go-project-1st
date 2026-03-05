# 🏨 Hotel Menu Manager - Project Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Technology Stack](#technology-stack)
4. [Architecture](#architecture)
5. [Database Design](#database-design)
6. [API Documentation](#api-documentation)
7. [Frontend Components](#frontend-components)
8. [Backend Structure](#backend-structure)
9. [Docker Setup](#docker-setup)
10. [Environment Configuration](#environment-configuration)

---

## Project Overview

**Hotel Menu Manager** is a full-stack web application designed for hotels and restaurants to manage their food menu items efficiently. The application provides a modern, responsive interface for CRUD (Create, Read, Update, Delete) operations on menu items.

### Purpose
- Streamline menu management for hotels and restaurants
- Provide real-time updates through a responsive interface
- Enable easy deployment via containerization
- Support both development and production environments

### Key Highlights
- **Full-Stack Solution**: Complete frontend and backend implementation
- **Modern Tech Stack**: Go, React, TypeScript, PostgreSQL
- **Containerized**: Fully dockerized for easy deployment
- **Production Ready**: CI/CD pipeline with GitHub Actions
- **Cost Effective**: Deploy on AWS EC2 without expensive RDS

---

## Features

### Core Functionality

#### 1. Menu Item Management
- ✅ Create new food items with name, category, price, and availability
- ✅ View all menu items in a responsive table
- ✅ Update existing items with inline editing
- ✅ Delete items with confirmation dialog
- ✅ Filter and search capabilities

#### 2. Category Organization
- **Breakfast** - Morning menu items
- **Lunch** - Midday offerings
- **Dinner** - Evening meals
- **Drinks** - Beverages
- **Desserts** - Sweet treats

Each category has color-coded badges for easy identification.

#### 3. Price Management
- Display prices in Sri Lankan Rupees (LKR)
- Support for decimal precision
- Easy price updates
- Sort by price (ascending/descending)

#### 4. Availability Tracking
- Toggle item availability on/off
- Visual indicators (✓ for available, ✗ for unavailable)
- Real-time status updates
- Filter by availability status

### User Experience Features
- **Real-time Feedback**: Toast notifications for all actions
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Form Validation**: Ensures data integrity
- **Confirmation Dialogs**: Prevents accidental deletions
- **Loading States**: Visual feedback during API operations
- **Error Handling**: User-friendly error messages

---

## Technology Stack

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| **Go** | 1.21+ | Backend programming language |
| **Gin** | Latest | Web framework for REST API |
| **lib/pq** | Latest | PostgreSQL driver |
| **gin-contrib/cors** | Latest | CORS middleware |
| **godotenv** | Latest | Environment variable management |

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18 | UI library |
| **TypeScript** | 5 | Type-safe JavaScript |
| **Vite** | 5 | Build tool and dev server |
| **Tailwind CSS** | 3 | Utility-first CSS framework |
| **Axios** | Latest | HTTP client |
| **Lucide React** | Latest | Icon library |

### Database
| Technology | Version | Purpose |
|------------|---------|---------|
| **PostgreSQL** | 16 | Primary database |
| **Docker Image** | postgres:16-alpine | Lightweight container |

### DevOps
| Technology | Version | Purpose |
|------------|---------|---------|
| **Docker** | Latest | Containerization |
| **Docker Compose** | Latest | Multi-container orchestration |
| **Nginx** | Alpine | Web server for production |
| **GitHub Actions** | - | CI/CD pipeline |
| **AWS EC2** | Ubuntu 24.04 | Production hosting |

---

## Architecture

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    User Browser                          │
│              (React + TypeScript SPA)                    │
└────────────────────┬───────────────────────────────────┘
                     │ HTTP/REST
                     │ Port 3000 (Development: 5173)
                     ▼
┌─────────────────────────────────────────────────────────┐
│              Nginx Web Server (Production)               │
│           - Serves static React build                    │
│           - Proxies /api/* to backend:8080              │
└────────────────────┬───────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                 Go Backend (Gin Framework)               │
│           - REST API endpoints                           │
│           - Business logic                               │
│           - CORS middleware                              │
│           - Database interaction                         │
│           Port: 8080                                     │
└────────────────────┬───────────────────────────────────┘
                     │ PostgreSQL Protocol
                     │ Port 5432
                     ▼
┌─────────────────────────────────────────────────────────┐
│              PostgreSQL Database                         │
│           - Stores food items                            │
│           - UUID primary keys                            │
│           - ACID compliance                              │
└─────────────────────────────────────────────────────────┘
```

### Development vs Production Architecture

| Component | Development | Production |
|-----------|-------------|------------|
| **Frontend** | Vite dev server (5173) | Nginx serving static build (80→3000) |
| **Backend** | Go binary (8080) | Dockerized Go binary (8080) |
| **Database** | Local PostgreSQL or Docker | Docker PostgreSQL (5432) |
| **API URL** | http://localhost:8080/api | /api (proxied via Nginx) |
| **CORS** | localhost:5173 | EC2 public IP |

---

## Database Design

### Schema Overview

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

### Field Specifications

| Column | Data Type | Constraints | Description |
|--------|-----------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Auto-generated unique identifier |
| `name` | VARCHAR(255) | NOT NULL | Food item name (e.g., "Caesar Salad") |
| `category` | VARCHAR(50) | NOT NULL | Category: Breakfast/Lunch/Dinner/Drinks/Desserts |
| `price` | NUMERIC(10,2) | NOT NULL | Price with 2 decimal places |
| `available` | BOOLEAN | DEFAULT true | Availability status |
| `created_at` | TIMESTAMP | DEFAULT now() | Creation timestamp |

### Sample Data

```sql
INSERT INTO foods (name, category, price, available) VALUES
('Caesar Salad', 'Lunch', 850.00, true),
('Grilled Chicken', 'Dinner', 1500.00, true),
('Pancakes', 'Breakfast', 650.00, true),
('Orange Juice', 'Drinks', 350.00, true),
('Chocolate Cake', 'Desserts', 550.00, false);
```

---

## API Documentation

### Base URL
- **Development**: `http://localhost:8080/api`
- **Production**: `http://[EC2_IP]:3000/api` (proxied via Nginx)

### Endpoints

#### 1. Get All Foods
```http
GET /api/foods
```

**Response**: `200 OK`
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Caesar Salad",
    "category": "Lunch",
    "price": 850.00,
    "available": true,
    "created_at": "2026-02-17T10:00:00Z"
  }
]
```

#### 2. Get Food by ID
```http
GET /api/foods/:id
```

**Response**: `200 OK`
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Caesar Salad",
  "category": "Lunch",
  "price": 850.00,
  "available": true,
  "created_at": "2026-02-17T10:00:00Z"
}
```

**Error**: `404 Not Found`
```json
{
  "error": "Food item not found"
}
```

#### 3. Create Food Item
```http
POST /api/foods
Content-Type: application/json
```

**Request Body**:
```json
{
  "name": "Caesar Salad",
  "category": "Lunch",
  "price": 850.00,
  "available": true
}
```

**Response**: `201 Created`
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Caesar Salad",
  "category": "Lunch",
  "price": 850.00,
  "available": true,
  "created_at": "2026-02-17T10:00:00Z"
}
```

**Validation Errors**: `400 Bad Request`
```json
{
  "error": "Invalid request body"
}
```

#### 4. Update Food Item
```http
PUT /api/foods/:id
Content-Type: application/json
```

**Request Body**:
```json
{
  "name": "Caesar Salad Deluxe",
  "category": "Lunch",
  "price": 950.00,
  "available": true
}
```

**Response**: `200 OK`
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Caesar Salad Deluxe",
  "category": "Lunch",
  "price": 950.00,
  "available": true,
  "created_at": "2026-02-17T10:00:00Z"
}
```

#### 5. Delete Food Item
```http
DELETE /api/foods/:id
```

**Response**: `204 No Content`

**Error**: `404 Not Found`
```json
{
  "error": "Food item not found"
}
```

### Common Error Responses

| Status Code | Description | Example |
|-------------|-------------|---------|
| 400 | Bad Request | Invalid JSON or missing required fields |
| 404 | Not Found | Resource doesn't exist |
| 500 | Internal Server Error | Database connection failed |

---

## Frontend Components

### Component Hierarchy

```
App.tsx
└── FoodList.tsx (Main Component)
    ├── FoodFormModal.tsx (Add/Edit)
    ├── DeleteConfirmModal.tsx (Confirmation)
    └── Toast.tsx (Notifications)

Services
└── foodService.ts (API Client)

Types
└── food.ts (TypeScript Interfaces)
```

### Component Details

#### 1. App.tsx
**Purpose**: Root component providing layout

**Responsibilities**:
- Main application structure
- Renders FoodList component
- Provides global styling

#### 2. FoodList.tsx
**Purpose**: Main dashboard displaying all food items

**State Management**:
```typescript
const [foods, setFoods] = useState<Food[]>([]);
const [loading, setLoading] = useState(false);
const [showAddModal, setShowAddModal] = useState(false);
const [editingFood, setEditingFood] = useState<Food | null>(null);
const [showDeleteModal, setShowDeleteModal] = useState(false);
const [deletingFood, setDeletingFood] = useState<Food | null>(null);
const [toast, setToast] = useState({ message: '', type: 'success', isVisible: false });
```

**Key Features**:
- Fetches and displays all food items
- Handles add, edit, delete operations
- Shows loading states
- Manages modal visibility
- Displays toast notifications

#### 3. FoodFormModal.tsx
**Purpose**: Modal form for creating and editing food items

**Props**:
```typescript
interface FoodFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (food: Partial<Food>) => void;
  initialData?: Food;
}
```

**Features**:
- Controlled form inputs
- Validation
- Category dropdown
- Price input with decimal support
- Availability toggle

#### 4. DeleteConfirmModal.tsx
**Purpose**: Confirmation dialog for delete operations

**Props**:
```typescript
interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
}
```

#### 5. Toast.tsx
**Purpose**: Notification system for user feedback

**Props**:
```typescript
interface ToastProps {
  message: string;
  type: 'success' | 'error';
  isVisible: boolean;
  onClose: () => void;
}
```

**Features**:
- Auto-dismiss after 3 seconds
- Color-coded (green for success, red for error)
- Slide-in animation

#### 6. foodService.ts
**Purpose**: API client for backend communication

**Functions**:
```typescript
export const getAllFoods = (): Promise<Food[]> => { }
export const getFoodById = (id: string): Promise<Food> => { }
export const createFood = (food: Partial<Food>): Promise<Food> => { }
export const updateFood = (id: string, food: Partial<Food>): Promise<Food> => { }
export const deleteFood = (id: string): Promise<void> => { }
```

---

## Backend Structure

### Directory Layout

```
backend/
├── config/
│   └── db.go              # Database connection
├── controllers/
│   └── food_controller.go # Request handlers
├── models/
│   └── food.go            # Data structures
├── routes/
│   └── food_routes.go     # Route definitions
├── main.go                # Application entry
├── go.mod                 # Dependencies
├── go.sum                 # Dependency checksums
├── .env                   # Environment variables
└── Dockerfile             # Container definition
```

### Key Files

#### main.go
```go
func main() {
    // Load environment variables
    godotenv.Load()
    
    // Connect to database
    config.Connect()
    
    // Initialize Gin router
    r := gin.Default()
    
    // Configure CORS
    r.Use(cors.New(corsConfig))
    
    // Register routes
    routes.SetupRoutes(r)
    
    // Start server
    r.Run(":8080")
}
```

#### config/db.go
- Database connection pooling
- Environment-based configuration
- Connection health checks
- Auto-reconnect logic

#### controllers/food_controller.go
- `GetAllFoods()` - Retrieve all items
- `GetFoodByID()` - Get single item
- `CreateFood()` - Add new item
- `UpdateFood()` - Modify existing item
- `DeleteFood()` - Remove item

#### models/food.go
```go
type Food struct {
    ID        string    `json:"id"`
    Name      string    `json:"name"`
    Category  string    `json:"category"`
    Price     float64   `json:"price"`
    Available bool      `json:"available"`
    CreatedAt time.Time `json:"created_at"`
}
```

---

## Docker Setup

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

**Benefits**:
- Smaller image size (~15MB vs 300MB+)
- No build tools in production
- Enhanced security

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

# Stage 2: Serve
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.prod.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Docker Compose Architecture

#### Development (docker-compose.yml)
```yaml
services:
  db:
    image: postgres:16-alpine
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
  
  backend:
    build: ./backend
    ports:
      - "8080:8080"
    depends_on:
      - db
  
  frontend:
    build: ./frontend
    ports:
      - "3000:80"
    depends_on:
      - backend
```

#### Production (docker-compose.prod.yml)
- Health checks for database
- Environment variable injection
- Volume persistence
- Restart policies
- Network isolation

---

## Environment Configuration

### Development (.env)
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=hotel_menu
DB_SSLMODE=disable

# Server
SERVER_PORT=8080

# CORS
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

### Production (.env)
```env
# Database (Docker service name)
DB_HOST=db
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=hotel_menu
DB_SSLMODE=disable

# Server
SERVER_PORT=8080

# CORS (EC2 public IP)
ALLOWED_ORIGINS=http://YOUR_EC2_IP:3000

# Frontend
VITE_API_URL=/api
```

### Critical Differences

| Variable | Development | Production |
|----------|-------------|------------|
| DB_HOST | localhost | db (Docker service) |
| ALLOWED_ORIGINS | localhost ports | EC2 public IP |
| VITE_API_URL | Full URL with port | /api (proxied) |

---

## Security Considerations

### Implemented Security Features
- ✅ CORS protection
- ✅ Environment variable separation
- ✅ SQL injection prevention (prepared statements)
- ✅ Input validation
- ✅ Error message sanitization
- ✅ Container isolation

### Recommended Enhancements
- [ ] HTTPS/TLS encryption
- [ ] JWT authentication
- [ ] Rate limiting
- [ ] Input sanitization
- [ ] SQL query logging
- [ ] Security headers (CSP, HSTS)

---

## Performance Optimization

### Current Optimizations
- Multi-stage Docker builds (smaller images)
- Gzip compression in Nginx
- React production build with tree shaking
- Database connection pooling
- Alpine Linux base images

### Future Improvements
- Redis caching layer
- CDN for static assets
- Database query optimization
- API response pagination
- WebSocket for real-time updates

---

## Summary

This Hotel Menu Manager application demonstrates:
- **Modern full-stack development** with Go and React
- **Clean architecture** with separated concerns
- **Containerization** best practices
- **Production-ready deployment** on AWS
- **CI/CD automation** with GitHub Actions
- **Cost-effective infrastructure** without expensive managed services

Perfect for learning DevOps practices, full-stack development, and cloud deployment!

---

For deployment instructions, see [DEPLOYMENT-GUIDE.md](DEPLOYMENT-GUIDE.md).
