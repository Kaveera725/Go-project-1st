# Hotel Menu Manager - Project Workflow

## 📋 Quick Overview

**Project**: Hotel Menu Manager  
**Tech Stack**: Go (Backend), React + TypeScript (Frontend), PostgreSQL (Database)  
**Deployment**: AWS EC2 with Docker  
**CI/CD**: GitHub Actions with Self-Hosted Runner  

---

## 🔄 Development Workflow

### 1. **Local Development**

```bash
# Start all services with Docker Compose
docker-compose up --build

# Services running:
# - Backend API: http://localhost:8080
# - Frontend: http://localhost:3000
# - PostgreSQL: localhost:5432
```

### 2. **Make Changes**

```bash
# Backend changes (Go)
cd backend/
# Edit files in controllers/, models/, routes/

# Frontend changes (React)
cd frontend/
# Edit files in src/components/, src/services/

# Database changes
cd database/
# Edit schema.sql or seed.sql
```

### 3. **Git Workflow**

```bash
# Check status
git status

# Stage changes
git add -A

# Commit with message
git commit -m "Your commit message"

# Push to GitHub
git push origin main
```

---

## 🚀 CI/CD Pipeline (Automated)

### Flow Diagram:
```
Push to GitHub → GitHub Actions → Self-Hosted Runner → Deploy to EC2
```

### Steps (Automatic):
1. **Trigger**: Push to `main` branch
2. **GitHub Actions**: Workflow starts (`deploy.yml`)
3. **Self-Hosted Runner**: Picks up the job on EC2
4. **Deployment Steps**:
   - Checkout code
   - Copy files to `~/Go-project-1st`
   - Stop existing containers
   - Build new Docker images
   - Start containers with `docker-compose`
   - Verify deployment

### Monitor Deployment:
- GitHub: https://github.com/Kaveera725/Go-project-1st/actions
- EC2: http://65.2.35.4:3000

---

## 👥 User Roles & Features

### **Admin**
1. Login with admin credentials
2. View Menu Items (table view)
3. Add/Edit/Delete menu items
4. View Customer Orders tab
5. Update order status (Pending → Preparing → Complete)

### **Customer**
1. Register/Login
2. Browse Menu Items
3. Add items to cart
4. Place orders
5. View My Orders tab with real-time status updates

---

## 🗂️ Project Structure

```
Go-project-1st/
├── backend/                 # Go API
│   ├── main.go             # Entry point
│   ├── controllers/        # API handlers
│   ├── models/             # Data models
│   ├── routes/             # Route definitions
│   ├── middleware/         # Auth middleware
│   └── config/             # Database config
├── frontend/               # React App
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── services/       # API calls
│   │   ├── contexts/       # Auth context
│   │   └── types/          # TypeScript types
│   └── index.html
├── database/               # SQL scripts
├── .github/workflows/      # CI/CD
└── docker-compose.yml      # Container orchestration
```

---

## 🔌 API Endpoints

### Public
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login
- `GET /api/foods` - Get all menu items

### Customer (Authenticated)
- `GET /api/auth/me` - Get current user
- `POST /api/orders` - Place order
- `GET /api/orders/my` - Get my orders

### Admin Only
- `POST /api/foods` - Add menu item
- `PUT /api/foods/:id` - Update menu item
- `DELETE /api/foods/:id` - Delete menu item
- `GET /api/orders` - Get all orders
- `PUT /api/orders/:id/status` - Update order status

---

## 💾 Database Schema

### Tables
- **users** - User accounts (username, password, role)
- **foods** - Menu items (name, category, price, available)
- **orders** - Customer orders (user_id, total_amount, status)
- **order_items** - Order line items (order_id, food_id, quantity)

---

## 🔧 Environment Variables

```env
# Database
DB_HOST=db
DB_PORT=5432
DB_USER=anushad
DB_PASSWORD=hotel_munu_pass
DB_NAME=hotel_menu

# Backend
SERVER_PORT=8080
JWT_SECRET=your-super-secret-jwt-key

# Frontend
ALLOWED_ORIGINS=http://65.2.35.4:3000
```

---

## 🐛 Quick Troubleshooting

### Containers not starting?
```bash
docker-compose logs
docker ps -a
```

### Database connection issues?
```bash
# Check .env file exists
cat .env

# Restart containers
docker-compose restart
```

### CI/CD failing?
```bash
# On EC2, check runner status
cd ~/actions-runner
./run.sh

# View workflow logs on GitHub
# Actions tab → Select failed run → View logs
```

---

## 📊 Order Status Flow

```
Customer places order
       ↓
   [Pending]
       ↓
Admin clicks "Start Preparing"
       ↓
  [Preparing]
       ↓
Admin clicks "Mark Complete"
       ↓
   [Complete]
```

*Customer sees real-time updates with 10-second auto-refresh*

---

## ⚡ Quick Commands

```bash
# Start development
docker-compose up --build

# Stop all services
docker-compose down

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Rebuild specific service
docker-compose up -d --build backend

# Clean everything and restart
docker-compose down -v
docker-compose up --build
```

---

## 🎯 Development Cycle (Summary)

1. **Code** → Write features locally
2. **Test** → Test with `docker-compose up`
3. **Commit** → `git commit -m "message"`
4. **Push** → `git push origin main`
5. **Deploy** → GitHub Actions auto-deploys to EC2
6. **Verify** → Check http://65.2.35.4:3000

**That's it! Simple and automated. 🚀**
