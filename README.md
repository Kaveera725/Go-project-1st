# 🏨 Hotel Menu Manager — Full-Stack CRUD

A modern hotel food menu management system built with **Go (Gin)**, **React + TypeScript**, and **PostgreSQL**.

![Tech Stack](https://img.shields.io/badge/Go-00ADD8?style=flat&logo=go&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white)

---

## 📚 Documentation

- **[Complete Deployment Guide](COMPLETE-DEPLOYMENT-GUIDE.md)** - Step-by-step deployment instructions (local + AWS EC2 + CI/CD)
- **[Project Documentation](PROJECT-DOCUMENTATION.md)** - Architecture, tech stack, API, and component details
- **[EC2 Deployment Steps](EC2-DEPLOYMENT-STEPS.md)** - Ubuntu-specific AWS deployment guide
- **[Quick Reference](QUICK-REFERENCE.md)** - Quick commands and troubleshooting
- **[Deployment Config Guide](DEPLOYMENT-CONFIG-GUIDE.md)** - Configuration details for production

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

## 🚀 Quick Start

### Prerequisites

- **Go** 1.21+  
- **Node.js** 18+  
- **PostgreSQL** 14+  
- **Docker** & **Docker Compose** (recommended)

---

### Option 1 — Run with Docker (Recommended ⭐)

```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/Go-project-1st.git
cd Go-project-1st

# Start all services
docker-compose up --build
```

**Access the application:**
- Frontend → http://localhost:3000  
- Backend API → http://localhost:8080/api/foods  
- PostgreSQL → localhost:5432 (auto-seeded)

---

### Option 2 — Run Manually

For detailed manual setup instructions, see [COMPLETE-DEPLOYMENT-GUIDE.md](COMPLETE-DEPLOYMENT-GUIDE.md#option-2-manual-setup-for-learning)

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
DB_PASProduction Deployment

Deploy to AWS EC2 with Docker Compose (no RDS needed - cost-effective!).

### Quick Deployment Steps

1. **Launch EC2 Instance** (Ubuntu 24.04 LTS, t2.micro - Free Tier)
2. **Install Docker and Docker Compose**
3. **Clone repository and configure `.env`**
4. **Run:** `docker-compose -f docker-compose.prod.yml up -d --build`

**Access your application:**
- **Frontend:** `http://YOUR_EC2_IP:3000`
- **Backend API:** `http://YOUR_EC2_IP:8080/api/foods`

### Detailed Deployment Guide

📖 **[Complete step-by-step instructions →](COMPLETE-DEPLOYMENT-GUIDE.md)**

Includes:
- ✅ EC2 setup and security configuration
- ✅ Docker and Docker Compose installation
- ✅ Environment configuration
- ✅ CI/CD with GitHub Actions (self-hosted runner)
- ✅ Troubleshooting common issues
- ✅ Maintenance and monitoring

### Cost Information

**Free Tier (First 12 months):**
- EC2 t2.micro: 750 hours/month FREE
- Storage: 30 GB EBS FREE
- **Total: $0/month** ✨

**After Free Tier:**
- ~$12-16/month (EC2 + storage + bandwidth)
- **Much cheaper than using RDS!**

---

## 🛠️ CI/CD & Automation

This project includes GitHub Actions workflows for automated deployment:

- **Self-hosted runner** - Deploy directly from EC2 instance
- **SSH-based deployment** - Deploy from GitHub cloud runners
- **Automated testing** - Run tests before deployment
- **Docker image building** - Automatic image updates

See [COMPLETE-DEPLOYMENT-GUIDE.md](COMPLETE-DEPLOYMENT-GUIDE.md#cicd-with-github-actions) for setup instructions.

---

## 📖 Additional Resources

- **[Complete Deployment Guide](COMPLETE-DEPLOYMENT-GUIDE.md)** - Full production deployment walkthrough
- **[Project Documentation](PROJECT-DOCUMENTATION.md)** - Technical architecture and component details
- **[EC2 Deployment Steps](EC2-DEPLOYMENT-STEPS.md)** - AWS-specific deployment guide
- **[Quick Reference](QUICK-REFERENCE.md)** - Quick commands for common tasks
- **[Config Guide](DEPLOYMENT-CONFIG-GUIDE.md)** - Environment and configuration details

---

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests
- Improve documentation

---

## 📜 License

MIT — feel free to use for learning and projects.
