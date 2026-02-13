# 🏨 Hotel Menu Manager — Full-Stack CRUD

A modern hotel food menu management system built with **Go (Gin)**, **React + TypeScript**, and **PostgreSQL**.

![Tech Stack](https://img.shields.io/badge/Go-00ADD8?style=flat&logo=go&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white)

---

## 📁 Project Structure

```
Go-project-1st/
├── backend/
│   ├── config/
│   │   └── db.go                # Database connection & table creation
│   ├── controllers/
│   │   └── food_controller.go   # CRUD handler functions
│   ├── models/
│   │   └── food.go              # Food struct / types
│   ├── routes/
│   │   └── food_routes.go       # Route definitions
│   ├── main.go                  # Entry point
│   ├── go.mod
│   ├── .env                     # Environment variables
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── FoodList.tsx           # Table view of all items
│   │   │   ├── FoodFormModal.tsx      # Add / Edit form modal
│   │   │   ├── DeleteConfirmModal.tsx # Delete confirmation dialog
│   │   │   └── Toast.tsx              # Success/error notifications
│   │   ├── services/
│   │   │   └── foodService.ts   # Axios API calls
│   │   ├── types/
│   │   │   └── food.ts          # TypeScript interfaces
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.ts
│   ├── nginx.conf
│   └── Dockerfile
├── database/
│   ├── schema.sql               # Table creation SQL
│   └── seed.sql                 # Sample menu data
├── docker-compose.yml
└── README.md
```

---

## 🔌 API Endpoints

| Method | Endpoint          | Description         |
|--------|-------------------|---------------------|
| POST   | `/api/foods`      | Create a food item  |
| GET    | `/api/foods`      | Get all food items  |
| GET    | `/api/foods/:id`  | Get food by ID      |
| PUT    | `/api/foods/:id`  | Update a food item  |
| DELETE | `/api/foods/:id`  | Delete a food item  |

---

## 🚀 Getting Started

### Prerequisites

- **Go** 1.21+  
- **Node.js** 18+  
- **PostgreSQL** 14+  
- (Optional) **Docker** & **Docker Compose**

---

### Option 1 — Run with Docker (Easiest)

```bash
docker-compose up --build
```

- Frontend → http://localhost:3000  
- Backend API → http://localhost:8080/api/foods  
- PostgreSQL → localhost:5432 (auto-seeded)

---

### Option 2 — Run Manually

#### 1. Set up PostgreSQL

```bash
# Create the database
psql -U postgres -c "CREATE DATABASE hotel_menu;"

# Run schema
psql -U postgres -d hotel_menu -f database/schema.sql

# (Optional) Seed sample data
psql -U postgres -d hotel_menu -f database/seed.sql
```

#### 2. Start the Backend

```bash
cd backend

# Edit .env if your DB credentials differ
# Then install dependencies and run:
go mod tidy
go run main.go
```

The API will be available at **http://localhost:8080**.

#### 3. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

The UI will be available at **http://localhost:5173**.

---

## 🗃️ Food Entity

| Field       | Type            | Description                           |
|-------------|-----------------|---------------------------------------|
| id          | UUID            | Auto-generated primary key            |
| name        | string          | Name of the dish                      |
| category    | string          | Breakfast / Lunch / Dinner / Drinks   |
| price       | NUMERIC(10,2)   | Price in dollars                      |
| available   | boolean         | Whether currently on the menu         |
| created_at  | timestamp       | When the item was created             |

---

## 🖥️ Frontend Features

- **Dashboard table** with sorting by category, price badges, and availability indicators  
- **Add / Edit modal** with form validation  
- **Delete confirmation** dialog  
- **Toast notifications** for success & error feedback  
- **Responsive** Tailwind CSS design  

---

## 📝 Environment Variables

Copy `.env.example` to `.env` in the `backend/` directory and update values:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=hotel_menu
DB_SSLMODE=disable
SERVER_PORT=8080
```

---

## ☁️ AWS Deployment (EC2 with Local PostgreSQL)

Deploy to AWS EC2 with PostgreSQL running in Docker (no RDS needed - cost-effective!).

### Quick Start

1. **Launch EC2 Instance** (t2.micro - Free Tier eligible)
2. **Push code to GitHub**
3. **SSH into EC2 and run:**

```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git ~/hotel-menu-manager
cd ~/hotel-menu-manager

# Configure environment
cp .env.example .env
nano .env  # Update with your EC2 public IP

# Deploy with Docker
docker-compose -f docker-compose.prod.yml up -d --build
```

### Detailed Instructions

See **[AWS-DEPLOYMENT-GUIDE.txt](AWS-DEPLOYMENT-GUIDE.txt)** for complete step-by-step instructions including:
- AWS account setup
- EC2 instance configuration
- Security group setup
- Docker installation
- Database initialization
- Troubleshooting

### Cost Information

**Free Tier (First 12 months):**
- EC2 t2.micro: 750 hours/month FREE
- No RDS charges (database in Docker)
- **Total: $0/month**

**After Free Tier:**
- ~$11-14/month (EC2 + storage)
- **Savings: $6-12/month vs using RDS**

### Access Your Application

- **Frontend**: `http://YOUR_EC2_IP:3000`
- **Backend API**: `http://YOUR_EC2_IP:8080/api/foods`

---

## 🛠️ Deployment Scripts

| Script | Description |
|--------|-------------|
| `deploy-aws.bat` | Windows batch file with interactive menu for AWS setup |
| `deploy-ec2.sh` | Linux shell script for automated EC2 deployment |
| `docker-compose.yml` | Local development with PostgreSQL container |
| `docker-compose.prod.yml` | Production deployment using AWS RDS |

---

## 📜 License

MIT — feel free to use for learning and projects.