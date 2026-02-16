# 🚀 Complete Deployment Guide - Hotel Menu Manager

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [AWS EC2 Production Deployment](#aws-ec2-production-deployment)
4. [CI/CD with GitHub Actions](#cicd-with-github-actions)
5. [Troubleshooting](#troubleshooting)
6. [Maintenance](#maintenance)

---

## Prerequisites

### For Local Development
- **Go** 1.21 or higher ([Download](https://go.dev/dl/))
- **Node.js** 18 or higher ([Download](https://nodejs.org/))
- **PostgreSQL** 14+ ([Download](https://www.postgresql.org/download/))
- **Git** ([Download](https://git-scm.com/downloads))
- **Docker Desktop** (optional, recommended) ([Download](https://www.docker.com/products/docker-desktop))

### For AWS Deployment
- **AWS Account** ([Sign up](https://aws.amazon.com/))
- **GitHub Account** ([Sign up](https://github.com/))
- **SSH Client** (Git Bash on Windows, built-in terminal on Mac/Linux)
- **Basic terminal/command line knowledge**

---

## Local Development Setup

### Option 1: Using Docker Compose (Recommended ⭐)

This is the easiest method as it sets up everything automatically.

#### Step 1: Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/Go-project-1st.git
cd Go-project-1st
```

#### Step 2: Start All Services
```bash
# Start database, backend, and frontend simultaneously
docker-compose up --build
```

Wait for all services to start. You'll see logs from all three containers.

#### Step 3: Access the Application
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8080/api/foods
- **Database:** localhost:5432 (credentials: postgres/postgres)

#### Step 4: Stop Services
```bash
# Stop all services (Ctrl+C in terminal, then)
docker-compose down

# Or to remove volumes too (clean slate)
docker-compose down -v
```

---

### Option 2: Manual Setup (For Learning)

This method runs each component separately, useful for understanding the stack.

#### Step 1: Set Up PostgreSQL Database

**Create Database:**
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE hotel_menu;

# Exit PostgreSQL
\q
```

**Apply Schema:**
```bash
psql -U postgres -d hotel_menu -f database/schema.sql
```

**Seed Sample Data (Optional):**
```bash
psql -U postgres -d hotel_menu -f database/seed.sql
```

**Verify:**
```bash
psql -U postgres -d hotel_menu -c "SELECT * FROM foods;"
```

#### Step 2: Configure Backend Environment

**Create `.env` file in `backend/` folder:**
```bash
cd backend
```

**Create `backend/.env`:**
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_postgres_password
DB_NAME=hotel_menu
DB_SSLMODE=disable

# Server Configuration
SERVER_PORT=8080

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

**Install Dependencies and Run:**
```bash
# Install Go dependencies
go mod tidy

# Run backend server
go run main.go
```

You should see:
```
✅ Connected to PostgreSQL database
[GIN-debug] Listening and serving HTTP on :8080
```

**Test Backend:**
```bash
curl http://localhost:8080/api/foods
```

#### Step 3: Set Up Frontend

**Open a new terminal and navigate to frontend:**
```bash
cd frontend
```

**Install Dependencies:**
```bash
npm install
```

**Create `.env` file in `frontend/` folder:**
```env
VITE_API_URL=http://localhost:8080/api
```

**Start Development Server:**
```bash
npm run dev
```

You should see:
```
VITE v5.x.x ready in XXX ms
➜  Local:   http://localhost:5173/
```

#### Step 4: Access the Application
Open http://localhost:5173 in your browser.

---

## AWS EC2 Production Deployment

### Phase 1: AWS Setup

#### Step 1: Launch EC2 Instance

1. **Log in to AWS Console:** https://console.aws.amazon.com/

2. **Navigate to EC2:**
   - Services → Compute → EC2
   - Click "Launch Instance"

3. **Configure Instance:**
   ```
   Name: hotel-menu-manager
   
   AMI: Ubuntu Server 24.04 LTS (Free tier eligible)
   
   Instance Type: t2.micro (1 vCPU, 1 GB RAM - Free tier)
   
   Key Pair: 
     - Click "Create new key pair"
     - Name: hotel-menu-key
     - Type: RSA
     - Format: .pem (Mac/Linux) or .ppk (Windows PuTTY)
     - Download and save securely
   
   Network Settings:
     - Create security group
     - Allow SSH (22) from My IP
     - Allow HTTP (80) from Anywhere
     - Allow Custom TCP (3000) from Anywhere
     - Allow Custom TCP (8080) from Anywhere
   
   Storage: 20 GB gp3 (minimum 15GB recommended)
   ```

4. **Launch Instance**

5. **Note Your Public IP:**
   - Select your instance
   - Copy "Public IPv4 address" (e.g., 65.2.35.4)

#### Step 2: Configure Security Group

**Add the following inbound rules:**

| Type | Protocol | Port Range | Source | Description |
|------|----------|------------|--------|-------------|
| SSH | TCP | 22 | My IP | SSH access |
| Custom TCP | TCP | 3000 | 0.0.0.0/0 | Frontend (Nginx) |
| Custom TCP | TCP | 8080 | 0.0.0.0/0 | Backend API (optional) |
| HTTP | TCP | 80 | 0.0.0.0/0 | Future use |

#### Step 3: Connect to EC2 Instance

**For Mac/Linux:**
```bash
# Set proper permissions for key file
chmod 400 ~/Downloads/hotel-menu-key.pem

# Connect via SSH
ssh -i ~/Downloads/hotel-menu-key.pem ubuntu@YOUR_EC2_PUBLIC_IP
```

**For Windows (Git Bash):**
```bash
ssh -i /c/Users/YOUR_USERNAME/Downloads/hotel-menu-key.pem ubuntu@YOUR_EC2_PUBLIC_IP
```

**For Windows (PuTTY):**
1. Open PuTTY
2. Host Name: ubuntu@YOUR_EC2_PUBLIC_IP
3. Connection → SSH → Auth → Browse for .ppk file
4. Click "Open"

---

### Phase 2: Server Setup

Once connected to your EC2 instance, run these commands:

#### Step 1: Update System
```bash
sudo apt update && sudo apt upgrade -y
```

#### Step 2: Install Docker
```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add ubuntu user to docker group
sudo usermod -aG docker ubuntu

# Start and enable Docker
sudo systemctl start docker
sudo systemctl enable docker

# Exit and reconnect for group changes to take effect
exit
```

**Reconnect to EC2 instance:**
```bash
ssh -i ~/Downloads/hotel-menu-key.pem ubuntu@YOUR_EC2_PUBLIC_IP
```

**Verify Docker:**
```bash
docker --version
docker ps
```

#### Step 3: Install Docker Compose
```bash
# Download Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# Make executable
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker-compose --version
```

#### Step 4: Install Git
```bash
sudo apt install git -y
git --version
```

---

### Phase 3: Deploy Application

#### Step 1: Clone Repository
```bash
cd ~
git clone https://github.com/YOUR_USERNAME/Go-project-1st.git
cd Go-project-1st
```

#### Step 2: Configure Environment

**Create production `.env` file in project root:**
```bash
nano .env
```

**Add this content (IMPORTANT - note the differences from local):**
```env
# Backend Environment Variables
DB_HOST=db
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=hotel_menu
DB_SSLMODE=disable
SERVER_PORT=8080

# Frontend URLs for CORS (use your EC2 public IP)
ALLOWED_ORIGINS=http://65.2.35.4:3000

# Frontend API URL (used during build)
VITE_API_URL=/api
```

**Save and exit:**
- Press `Ctrl + X`
- Press `Y` to confirm
- Press `Enter`

**⚠️ Critical Configuration Notes:**
- `DB_HOST=db` (NOT localhost) - This is the Docker Compose service name
- `DB_USER=postgres` - Must match the PostgreSQL container user
- `ALLOWED_ORIGINS` - Use your actual EC2 public IP
- `VITE_API_URL=/api` - Relative path for Nginx proxy

#### Step 3: Build and Start Services
```bash
# Build all Docker images and start containers
docker-compose -f docker-compose.prod.yml up -d --build
```

This will:
1. Pull PostgreSQL 16 Alpine image
2. Build Go backend from source
3. Build React frontend and create production bundle
4. Start all three containers

**Expected output:**
```
Creating network "go-project-1st_default" with the default driver
Creating volume "go-project-1st_pgdata" with default driver
Building backend
[+] Building 45.2s
Successfully built abc123def456
Successfully tagged go-project-1st_backend:latest
Building frontend
[+] Building 78.5s
Successfully built 789ghi012jkl
Successfully tagged go-project-1st_frontend:latest
Creating hotel_menu_db ... done
Creating hotel_menu_backend ... done
Creating hotel_menu_frontend ... done
```

#### Step 4: Verify Deployment
```bash
# Check container status (all should show "Up")
docker-compose -f docker-compose.prod.yml ps

# Check backend logs
docker-compose -f docker-compose.prod.yml logs backend | tail -20

# Check frontend logs
docker-compose -f docker-compose.prod.yml logs frontend | tail -20

# Check database logs
docker-compose -f docker-compose.prod.yml logs db | tail -20
```

**Expected backend logs:**
```
✅ Connected to PostgreSQL database
[GIN-debug] Listening and serving HTTP on :8080
```

**Expected database logs:**
```
database system is ready to accept connections
```

#### Step 5: Test the Application

**Test from EC2 instance:**
```bash
# Test backend API
curl http://localhost:8080/api/foods

# Test frontend
curl -I http://localhost:3000
```

**Test from your computer:**
- **Frontend:** Open http://YOUR_EC2_IP:3000 in browser
- **Backend API:** Visit http://YOUR_EC2_IP:8080/api/foods

You should see the food management interface with sample data!

---

### Phase 4: Domain Setup (Optional but Recommended)

#### Using a Custom Domain

If you have a domain (e.g., from Namecheap, GoDaddy):

1. **Create DNS A Record:**
   ```
   Type: A
   Host: @ (or subdomain like 'menu')
   Value: YOUR_EC2_IP
   TTL: 3600
   ```

2. **Update `.env` file:**
   ```env
   ALLOWED_ORIGINS=http://yourdomain.com:3000
   ```

3. **Rebuild frontend:**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d --build frontend
   ```

---

## CI/CD with GitHub Actions

### Option 1: Self-Hosted Runner (Recommended for EC2)

This runs the CI/CD pipeline directly on your EC2 instance.

#### Step 1: Install Self-Hosted Runner on EC2

**On your EC2 instance:**
```bash
# Create directory for runner
mkdir -p ~/actions-runner && cd ~/actions-runner

# Download latest runner
curl -o actions-runner-linux-x64-2.314.1.tar.gz -L https://github.com/actions/runner/releases/download/v2.314.1/actions-runner-linux-x64-2.314.1.tar.gz

# Extract
tar xzf ./actions-runner-linux-x64-2.314.1.tar.gz
```

#### Step 2: Configure Runner

1. **Get Registration Token:**
   - Go to your GitHub repository
   - Settings → Actions → Runners
   - Click "New self-hosted runner"
   - Select Linux
   - Copy the token from the configuration command

2. **Configure Runner:**
```bash
./config.sh --url https://github.com/YOUR_USERNAME/Go-project-1st --token YOUR_RUNNER_TOKEN

# When prompted:
# Enter name of runner: hotel-menu-ec2-runner
# Runner group: (press Enter for default)
# Labels: self-hosted,Linux,X64 (press Enter)
# Work folder: (press Enter for default)
```

#### Step 3: Install and Start Runner as Service
```bash
# Install service
sudo ./svc.sh install

# Start service
sudo ./svc.sh start

# Check status
sudo ./svc.sh status
```

#### Step 4: Update GitHub Actions Workflow

The workflow file `.github/workflows/deploy.yml` should have:

```yaml
name: Deploy Hotel Menu Manager

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: self-hosted
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Pull latest changes
        run: |
          cd ~/Go-project-1st
          git pull origin main

      - name: Deploy with Docker Compose
        run: |
          cd ~/Go-project-1st
          docker-compose -f docker-compose.prod.yml down
          docker-compose -f docker-compose.prod.yml up -d --build

      - name: Wait for services
        run: sleep 15

      - name: Check service health
        run: |
          cd ~/Go-project-1st
          docker-compose -f docker-compose.prod.yml ps
          curl -f http://localhost:8080/api/foods || exit 1
          curl -f http://localhost:3000 || exit 1

      - name: Clean up old images
        run: docker image prune -af
```

#### Step 5: Test CI/CD Pipeline

```bash
# On your local machine, make a change and push
echo "# Test deployment" >> README.md
git add README.md
git commit -m "Test CI/CD pipeline"
git push origin main
```

**Monitor deployment:**
- Go to GitHub repository → Actions tab
- Watch the deployment workflow run
- Check each step's logs

---

### Option 2: SSH-Based Deployment (Alternative)

If you prefer GitHub's cloud runners with SSH deployment:

#### Step 1: Add GitHub Secrets

Go to repository → Settings → Secrets and variables → Actions → New repository secret

Add these secrets:
```
EC2_HOST = YOUR_EC2_PUBLIC_IP
EC2_USERNAME = ubuntu
EC2_SSH_KEY = <content of your .pem file>
```

#### Step 2: Verify Workflow File

Ensure `.github/workflows/deploy.yml` uses SSH action:

```yaml
name: Deploy to EC2

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - name: Deploy via SSH
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.EC2_HOST }}
          username: ${{ secrets.EC2_USERNAME }}
          key: ${{ secrets.EC2_SSH_KEY }}
          script: |
            cd ~/Go-project-1st
            git pull origin main
            docker-compose -f docker-compose.prod.yml down
            docker-compose -f docker-compose.prod.yml up -d --build
```

---

## Troubleshooting

### Common Issues and Solutions

#### Issue 1: Backend Container Keeps Restarting

**Symptoms:**
```bash
docker-compose ps
# Shows: Restarting
```

**Check logs:**
```bash
docker-compose -f docker-compose.prod.yml logs backend
```

**Common causes and fixes:**

**A. Database Connection Failed**
```
Failed to ping database: pq: password authentication failed
```
**Fix:**
```bash
# Edit .env file
nano .env

# Ensure:
DB_HOST=db
DB_USER=postgres
DB_PASSWORD=postgres

# Restart
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d
```

**B. Port Already in Use**
```
bind: address already in use
```
**Fix:**
```bash
# Find process using port 8080
sudo lsof -i :8080

# Kill the process
sudo kill -9 <PID>

# Or change the port in docker-compose.prod.yml
```

#### Issue 2: Frontend Shows 502 Bad Gateway

**Symptoms:**
- Frontend loads but API calls fail
- Browser console shows: `GET http://X.X.X.X:3000/api/foods 502`

**Fix:**
```bash
# Check if backend is running
docker-compose -f docker-compose.prod.yml ps

# Check backend logs
docker-compose -f docker-compose.prod.yml logs backend

# If backend is down, restart it
docker-compose -f docker-compose.prod.yml restart backend

# Verify nginx proxy config
docker exec hotel_menu_frontend cat /etc/nginx/conf.d/default.conf
```

#### Issue 3: No Space Left on Device

**Symptoms:**
```
ERROR: write /var/lib/docker/tmp/...: no space left on device
```

**Check disk usage:**
```bash
df -h
```

**Fix Option 1: Clean Docker**
```bash
# Remove unused images
docker image prune -a

# Remove unused volumes
docker volume prune

# Remove everything unused
docker system prune -a --volumes
```

**Fix Option 2: Expand EBS Volume**

1. **In AWS Console:**
   - EC2 → Volumes
   - Select your volume
   - Actions → Modify Volume
   - Increase size (e.g., 20 GB)
   - Click "Modify"

2. **On EC2 instance:**
```bash
# Check current size
lsblk

# Grow partition (replace xvda1 with your partition)
sudo growpart /dev/xvda 1

# Resize filesystem
sudo resize2fs /dev/xvda1

# Verify
df -h
```

#### Issue 4: CORS Errors

**Symptoms:**
```
Access to XMLHttpRequest blocked by CORS policy
```

**Fix:**
```bash
# Edit .env file
nano .env

# Update ALLOWED_ORIGINS with your actual EC2 IP
ALLOWED_ORIGINS=http://YOUR_EC2_IP:3000

# Rebuild backend
docker-compose -f docker-compose.prod.yml up -d --build backend
```

#### Issue 5: Database Won't Initialize

**Symptoms:**
- Empty foods table
- Schema not applied

**Fix:**
```bash
# Remove volume and recreate
docker-compose -f docker-compose.prod.yml down -v
docker-compose -f docker-compose.prod.yml up -d

# Or manually execute SQL
docker exec -it hotel_menu_db psql -U postgres -d hotel_menu -f /docker-entrypoint-initdb.d/01-schema.sql
docker exec -it hotel_menu_db psql -U postgres -d hotel_menu -f /docker-entrypoint-initdb.d/02-seed.sql
```

#### Issue 6: Self-Hosted Runner "Already Configured"

**Symptoms:**
```
Cannot configure the runner because it is already configured
```

**Fix:**
```bash
cd ~/actions-runner

# Stop service
sudo ./svc.sh stop

# Uninstall service
sudo ./svc.sh uninstall

# Remove configuration
./config.sh remove --token YOUR_REMOVAL_TOKEN

# Reconfigure with new token
./config.sh --url https://github.com/YOUR_USERNAME/Go-project-1st --token YOUR_NEW_TOKEN

# Reinstall and start
sudo ./svc.sh install
sudo ./svc.sh start
```

#### Issue 7: Can't Access Application from Browser

**Checklist:**
1. **Verify containers are running:**
```bash
docker-compose -f docker-compose.prod.yml ps
```

2. **Check security group:**
   - Port 3000 should allow inbound from 0.0.0.0/0
   - Port 8080 (optional)

3. **Test from EC2:**
```bash
curl http://localhost:3000
curl http://localhost:8080/api/foods
```

4. **Check EC2 public IP:**
```bash
curl ifconfig.me
```

5. **Verify .env file:**
```bash
cat .env | grep ALLOWED_ORIGINS
```

---

## Maintenance

### Regular Tasks

#### Update Application Code
```bash
cd ~/Go-project-1st
git pull origin main
docker-compose -f docker-compose.prod.yml up -d --build
```

#### View Logs
```bash
# All services
docker-compose -f docker-compose.prod.yml logs -f

# Specific service
docker-compose -f docker-compose.prod.yml logs -f backend

# Last 50 lines
docker-compose -f docker-compose.prod.yml logs --tail=50
```

#### Restart Services
```bash
# Restart all
docker-compose -f docker-compose.prod.yml restart

# Restart specific service
docker-compose -f docker-compose.prod.yml restart backend
```

#### Backup Database
```bash
# Create backup
docker exec hotel_menu_db pg_dump -U postgres hotel_menu > backup_$(date +%Y%m%d).sql

# Restore backup
docker exec -i hotel_menu_db psql -U postgres hotel_menu < backup_20260216.sql
```

#### Monitor Resource Usage
```bash
# Container stats
docker stats

# Disk usage
df -h

# Docker disk usage
docker system df
```

#### Clean Up Old Images
```bash
# Remove unused images (keep current ones)
docker image prune -a -f

# Remove all stopped containers
docker container prune -f

# Remove unused volumes (⚠️ THIS WILL DELETE DATA)
docker volume prune -f
```

---

## Performance Optimization

### For Faster Builds

**Use BuildKit:**
```bash
export DOCKER_BUILDKIT=1
docker-compose -f docker-compose.prod.yml build
```

### For Lower Memory Usage

**Limit container resources in `docker-compose.prod.yml`:**
```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          memory: 256M
```

### For Faster Response Times

**Add Redis caching (future enhancement)**
**Use CDN for frontend assets**
**Enable Gzip compression** (already enabled in nginx.prod.conf)

---

## Security Best Practices

1. **Change default passwords:**
   ```bash
   # Use strong passwords in .env
   DB_PASSWORD=<use a strong random password>
   ```

2. **Restrict security group:**
   ```
   # Allow SSH only from your IP, not 0.0.0.0/0
   ```

3. **Keep system updated:**
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

4. **Use HTTPS:**
   - Set up Let's Encrypt SSL certificate
   - Configure Nginx for HTTPS

5. **Regular backups:**
   - Automated daily database backups
   - Store backups in S3

---

## Cost Optimization

### Free Tier Usage (First 12 Months)
- **EC2 t2.micro:** 750 hours/month FREE
- **Storage:** 30 GB EBS FREE
- **Data transfer:** 15 GB out FREE

### Estimated Costs After Free Tier
- **EC2 t2.micro:** ~$9/month
- **EBS 20GB:** ~$2/month
- **Data transfer:** ~$1-5/month

**Total: ~$12-16/month**

### Tips to Reduce Costs
1. Stop EC2 when not in use (dev/test environments)
2. Use smaller EBS volumes
3. Enable detailed monitoring only when needed
4. Use S3 for static assets instead of EBS

---

## Next Steps

1. ✅ **Set up monitoring:** Use AWS CloudWatch or external services
2. ✅ **Configure SSL/HTTPS:** Use Let's Encrypt for free SSL certificates
3. ✅ **Add more features:** Implement user authentication, image uploads, etc.
4. ✅ **Set up staging environment:** Use separate EC2 or Docker containers
5. ✅ **Implement automated backups:** Daily database dumps to S3

---

## Support and Resources

- **Project Documentation:** [PROJECT-DOCUMENTATION.md](PROJECT-DOCUMENTATION.md)
- **Quick Reference:** [QUICK-REFERENCE.md](QUICK-REFERENCE.md)
- **GitHub Repository:** https://github.com/YOUR_USERNAME/Go-project-1st
- **AWS Documentation:** https://docs.aws.amazon.com/
- **Docker Documentation:** https://docs.docker.com/
- **Go Documentation:** https://go.dev/doc/
- **React Documentation:** https://react.dev/

---

**🎉 Congratulations! Your application is now deployed and accessible worldwide!**
