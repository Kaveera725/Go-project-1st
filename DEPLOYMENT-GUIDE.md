# 🚀 Deployment Guide - Hotel Menu Manager

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [AWS EC2 Production Deployment](#aws-ec2-production-deployment)
4. [CI/CD Setup with GitHub Actions](#cicd-setup-with-github-actions)
5. [Post-Deployment Configuration](#post-deployment-configuration)
6. [Troubleshooting](#troubleshooting)
7. [Maintenance & Updates](#maintenance--updates)

---

## Prerequisites

### For Local Development
- ✅ **Go 1.21+** - [Download](https://go.dev/dl/)
- ✅ **Node.js 18+** - [Download](https://nodejs.org/)
- ✅ **PostgreSQL 14+** - [Download](https://www.postgresql.org/download/)
- ✅ **Git** - [Download](https://git-scm.com/downloads)
- ✅ **Docker Desktop** (optional) - [Download](https://www.docker.com/products/docker-desktop)

### For AWS Deployment
- ✅ **AWS Account** - [Sign up](https://aws.amazon.com/)
- ✅ **GitHub Account** - [Sign up](https://github.com/)
- ✅ **SSH Client** (Git Bash/Terminal)
- ✅ **Basic Linux/Terminal Knowledge**

---

## Local Development Setup

### Method 1: Using Docker Compose (Recommended ⭐)

This is the easiest way to run the entire stack locally.

#### Step 1: Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/Go-project-1st.git
cd Go-project-1st
```

#### Step 2: Start All Services
```bash
docker-compose up --build
```

Wait for all containers to start. You'll see logs like:
```
hotel_menu_db        | database system is ready to accept connections
hotel_menu_backend   | ✅ Connected to PostgreSQL database
hotel_menu_backend   | [GIN-debug] Listening and serving HTTP on :8080
hotel_menu_frontend  | /docker-entrypoint.sh: Configuration complete
```

#### Step 3: Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080/api/foods
- **Database**: localhost:5432 (postgres/postgres)

#### Step 4: Stop Services
```bash
# Press Ctrl+C, then:
docker-compose down

# To remove volumes (clean slate):
docker-compose down -v
```

---

### Method 2: Manual Setup

Run each component separately for development.

#### Step 1: Set Up PostgreSQL Database

**Create the database:**
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE hotel_menu;

# Exit
\q
```

**Apply schema:**
```bash
psql -U postgres -d hotel_menu -f database/schema.sql
```

**Load sample data:**
```bash
psql -U postgres -d hotel_menu -f database/seed.sql
```

**Verify:**
```bash
psql -U postgres -d hotel_menu -c "SELECT * FROM foods;"
```

#### Step 2: Configure and Run Backend

**Navigate to backend folder:**
```bash
cd backend
```

**Create `.env` file:**
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

**Install dependencies and run:**
```bash
# Install Go dependencies
go mod tidy

# Run the server
go run main.go
```

**Expected output:**
```
✅ Connected to PostgreSQL database
[GIN-debug] Listening and serving HTTP on :8080
```

**Test the API:**
```bash
curl http://localhost:8080/api/foods
```

#### Step 3: Configure and Run Frontend

**Open new terminal and navigate to frontend:**
```bash
cd frontend
```

**Install dependencies:**
```bash
npm install
```

**Create `.env` file (optional):**
```env
VITE_API_URL=http://localhost:8080/api
```

**Start development server:**
```bash
npm run dev
```

**Expected output:**
```
VITE v5.x.x  ready in xxx ms
➜  Local:   http://localhost:5173/
```

#### Step 4: Open in Browser
Navigate to http://localhost:5173

---

## AWS EC2 Production Deployment

### Phase 1: AWS Setup

#### Step 1: Launch EC2 Instance

1. **Sign in to AWS Console**: https://console.aws.amazon.com/

2. **Navigate to EC2**:
   - Services → EC2 → Instances → Launch Instance

3. **Configure Instance**:

   **Name and Tags:**
   ```
   Name: hotel-menu-manager
   ```

   **Application and OS Images:**
   ```
   AMI: Ubuntu Server 24.04 LTS (HVM), SSD Volume Type
   Architecture: 64-bit (x86)
   Free tier eligible: Yes
   ```

   **Instance Type:**
   ```
   Type: t2.micro (1 vCPU, 1 GiB RAM)
   Free tier eligible: ✅
   ```

   **Key Pair:**
   ```
   1. Click "Create new key pair"
   2. Name: hotel-menu-key
   3. Type: RSA
   4. Format: .pem (Mac/Linux) or .ppk (Windows PuTTY)
   5. Click "Create key pair"
   6. Save the file securely
   ```

   **Network Settings:**
   ```
   ☑ Create security group
   Security group name: hotel-menu-sg
   Description: Security group for Hotel Menu Manager
   ```

   **Inbound Security Group Rules:**
   
   | Type | Protocol | Port | Source | Description |
   |------|----------|------|--------|-------------|
   | SSH | TCP | 22 | My IP | SSH access |
   | Custom TCP | TCP | 3000 | 0.0.0.0/0 | Frontend (Nginx) |
   | Custom TCP | TCP | 8080 | 0.0.0.0/0 | Backend API (optional) |
   | HTTP | TCP | 80 | 0.0.0.0/0 | Future use |

   **Storage:**
   ```
   Size: 20 GiB
   Volume type: gp3 (General Purpose SSD)
   Delete on termination: Yes
   ```

4. **Launch Instance**

5. **Note Your Public IP**:
   - Wait for instance state: "Running"
   - Copy "Public IPv4 address" (e.g., 65.2.35.4)

#### Step 2: Connect to EC2 Instance

**For Mac/Linux:**
```bash
# Set proper permissions
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
2. Host Name: `ubuntu@YOUR_EC2_PUBLIC_IP`
3. Connection → SSH → Auth → Browse for .ppk file
4. Click "Open"

---

### Phase 2: Server Configuration

Once connected to your EC2 instance:

#### Step 1: Update System Packages
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

**Reconnect to EC2:**
```bash
ssh -i ~/Downloads/hotel-menu-key.pem ubuntu@YOUR_EC2_PUBLIC_IP
```

**Verify Docker installation:**
```bash
docker --version
docker ps
```

#### Step 3: Install Docker Compose
```bash
# Download Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# Make it executable
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

#### Step 1: Clone Your Repository
```bash
cd ~
git clone https://github.com/YOUR_USERNAME/Go-project-1st.git
cd Go-project-1st
```

#### Step 2: Create Production Environment File

**Create `.env` file in the project root:**
```bash
nano .env
```

**Add this content (IMPORTANT - use your EC2 IP):**
```env
# Backend Environment Variables
DB_HOST=db
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=hotel_menu
DB_SSLMODE=disable
SERVER_PORT=8080

# Frontend URLs for CORS (replace with your EC2 IP)
ALLOWED_ORIGINS=http://65.2.35.4:3000

# Frontend API URL (used during build)
VITE_API_URL=/api
```

**Save and exit:**
- Press `Ctrl + X`
- Press `Y` to confirm
- Press `Enter`

**⚠️ Critical Notes:**
- Replace `65.2.35.4` with your actual EC2 public IP
- `DB_HOST=db` is the Docker Compose service name (NOT localhost)
- `DB_USER=postgres` must match the PostgreSQL container default
- `VITE_API_URL=/api` is a relative path for Nginx proxy

#### Step 3: Build and Start Services
```bash
# Build images and start containers in detached mode
docker-compose -f docker-compose.prod.yml up -d --build
```

**This process will:**
1. Pull PostgreSQL 16 Alpine image (~80MB)
2. Build Go backend from source (~2-3 minutes)
3. Build React frontend with production optimizations (~3-5 minutes)
4. Initialize database with schema and seed data
5. Start all three containers

**Building progress:**
```
[+] Building backend...
[+] Building frontend...
Creating hotel_menu_db ... done
Creating hotel_menu_backend ... done
Creating hotel_menu_frontend ... done
```

#### Step 4: Verify Deployment

**Check container status:**
```bash
docker-compose -f docker-compose.prod.yml ps
```

**Expected output (all should show "Up"):**
```
       Name                     Command               State           Ports
--------------------------------------------------------------------------------
hotel_menu_backend    ./server                       Up      0.0.0.0:8080->8080/tcp
hotel_menu_db         docker-entrypoint.sh postgres  Up      0.0.0.0:5432->5432/tcp
hotel_menu_frontend   nginx -g daemon off            Up      0.0.0.0:3000->80/tcp
```

**Check logs:**
```bash
# View all logs
docker-compose -f docker-compose.prod.yml logs

# View backend logs
docker-compose -f docker-compose.prod.yml logs backend

# Follow logs in real-time
docker-compose -f docker-compose.prod.yml logs -f
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

**From EC2 instance:**
```bash
# Test backend API
curl http://localhost:8080/api/foods

# Test frontend
curl -I http://localhost:3000
```

**From your computer:**
- **Frontend**: Open http://YOUR_EC2_IP:3000 in browser
- **Backend API**: Visit http://YOUR_EC2_IP:8080/api/foods

**✅ You should see the food menu interface with sample data!**

---

## CI/CD Setup with GitHub Actions

### Option 1: Self-Hosted Runner on EC2 (Recommended)

This runs CI/CD directly on your EC2 instance, eliminating the need for SSH keys.

#### Step 1: Download Self-Hosted Runner

**On your EC2 instance:**
```bash
# Create directory for runner
mkdir -p ~/actions-runner && cd ~/actions-runner

# Download latest runner (check for newer versions)
curl -o actions-runner-linux-x64-2.314.1.tar.gz -L \
  https://github.com/actions/runner/releases/download/v2.314.1/actions-runner-linux-x64-2.314.1.tar.gz

# Extract
tar xzf ./actions-runner-linux-x64-2.314.1.tar.gz
```

#### Step 2: Get Registration Token

1. Go to your GitHub repository
2. Click **Settings** → **Actions** → **Runners**
3. Click **"New self-hosted runner"**
4. Select **Linux** as the OS
5. Copy the token from the configuration command (looks like: `A...Z`)

#### Step 3: Configure Runner

```bash
# Run configuration (replace YOUR_TOKEN with actual token)
./config.sh \
  --url https://github.com/YOUR_USERNAME/Go-project-1st \
  --token YOUR_RUNNER_TOKEN

# When prompted:
# - Enter name of runner: hotel-menu-ec2-runner
# - Runner group: [Press Enter for default]
# - Labels: [Press Enter to use defaults]
# - Work folder: [Press Enter for default]
```

#### Step 4: Install and Start Runner as Service

```bash
# Install service
sudo ./svc.sh install

# Start service
sudo ./svc.sh start

# Check status
sudo ./svc.sh status
```

**Expected output:**
```
● actions.runner.YOUR-RUNNER.service - GitHub Actions Runner
   Loaded: loaded
   Active: active (running)
```

#### Step 5: Create Workflow File

**On your local machine, create `.github/workflows/deploy.yml`:**

```yaml
name: Deploy to EC2

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

      - name: Wait for services to start
        run: sleep 15

      - name: Verify deployment
        run: |
          cd ~/Go-project-1st
          docker-compose -f docker-compose.prod.yml ps
          curl -f http://localhost:8080/api/foods || exit 1
          curl -f http://localhost:3000 || exit 1

      - name: Clean up old images
        run: docker image prune -af
```

#### Step 6: Push and Test

```bash
# Add, commit, and push the workflow
git add .github/workflows/deploy.yml
git commit -m "Add self-hosted runner CI/CD workflow"
git push origin main
```

**Monitor deployment:**
- Go to your GitHub repository
- Click **Actions** tab
- Watch the workflow run in real-time

---

### Option 2: SSH-Based Deployment (Alternative)

If you prefer using GitHub's cloud runners:

#### Step 1: Add GitHub Secrets

1. Go to repository → **Settings** → **Secrets and variables** → **Actions**
2. Click **"New repository secret"**
3. Add these secrets:

```
Name: EC2_HOST
Value: YOUR_EC2_PUBLIC_IP

Name: EC2_USERNAME
Value: ubuntu

Name: EC2_SSH_KEY
Value: <paste entire content of your .pem file>
```

#### Step 2: Create Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to EC2 via SSH

on:
  push:
    branches: [ main ]
  workflow_dispatch:

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
            sleep 10
            docker-compose -f docker-compose.prod.yml ps
```

---

## Post-Deployment Configuration

### 1. Set Up Custom Domain (Optional)

If you own a domain:

1. **Add DNS A Record:**
   ```
   Type: A
   Host: @ (or subdomain like 'menu')
   Value: YOUR_EC2_IP
   TTL: 3600
   ```

2. **Update `.env` on EC2:**
   ```bash
   nano ~/Go-project-1st/.env
   # Change ALLOWED_ORIGINS to your domain
   ALLOWED_ORIGINS=http://yourdomain.com:3000
   ```

3. **Restart services:**
   ```bash
   cd ~/Go-project-1st
   docker-compose -f docker-compose.prod.yml restart
   ```

### 2. Set Up HTTPS (Recommended)

**Using Certbot and Let's Encrypt:**
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtain certificate (replace with your domain)
sudo certbot --nginx -d yourdomain.com
```

### 3. Configure Backup

**Database backup script:**
```bash
# Create backup script
cat > ~/backup-db.sh << 'EOF'
#!/bin/bash
BACKUP_DIR=~/backups
mkdir -p $BACKUP_DIR
DATE=$(date +%Y%m%d_%H%M%S)
docker exec hotel_menu_db pg_dump -U postgres hotel_menu > $BACKUP_DIR/backup_$DATE.sql
# Keep only last 7 days
find $BACKUP_DIR -name "backup_*.sql" -mtime +7 -delete
EOF

# Make executable
chmod +x ~/backup-db.sh

# Add to crontab (daily at 2 AM)
(crontab -l 2>/dev/null; echo "0 2 * * * ~/backup-db.sh") | crontab -
```

---

## Troubleshooting

### Issue 1: Backend Container Keeps Restarting

**Check logs:**
```bash
docker-compose -f docker-compose.prod.yml logs backend
```

**Common causes:**

**A. Database Connection Failed**
```
Error: pq: password authentication failed for user "postgres"
```
**Solution:**
```bash
nano .env
# Verify:
DB_HOST=db
DB_USER=postgres
DB_PASSWORD=postgres

# Restart
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d
```

**B. Port Already in Use**
```
Error: bind: address already in use
```
**Solution:**
```bash
sudo lsof -i :8080
sudo kill -9 <PID>
```

### Issue 2: Frontend Shows 502 Bad Gateway

**Diagnosis:**
```bash
# Check if backend is running
docker-compose -f docker-compose.prod.yml ps

# Check backend logs
docker-compose -f docker-compose.prod.yml logs backend

# Verify nginx config
docker exec hotel_menu_frontend cat /etc/nginx/conf.d/default.conf
```

**Solution:**
```bash
# Restart backend
docker-compose -f docker-compose.prod.yml restart backend

# Or rebuild
docker-compose -f docker-compose.prod.yml up -d --build backend
```

### Issue 3: No Space Left on Device

**Check disk usage:**
```bash
df -h
docker system df
```

**Clean up Docker:**
```bash
# Remove unused images
docker image prune -a -f

# Remove unused containers
docker container prune -f

# Remove unused volumes (⚠️ THIS DELETES DATA)
docker volume prune -f

# Remove everything (except volumes)
docker system prune -a -f
```

**Expand EBS Volume:**

1. **AWS Console**: EC2 → Volumes → Select volume → Actions → Modify Volume
2. **Increase size** (e.g., to 30 GB)
3. **On EC2 instance:**
```bash
# Check current size
lsblk

# Grow partition
sudo growpart /dev/xvda 1

# Resize filesystem
sudo resize2fs /dev/xvda1

# Verify
df -h
```

### Issue 4: CORS Errors in Browser Console

**Error:**
```
Access to XMLHttpRequest blocked by CORS policy
```

**Solution:**
```bash
# Edit .env
nano ~/Go-project-1st/.env

# Update with correct EC2 IP
ALLOWED_ORIGINS=http://YOUR_EC2_IP:3000

# Rebuild backend
cd ~/Go-project-1st
docker-compose -f docker-compose.prod.yml up -d --build backend
```

### Issue 5: Self-Hosted Runner Already Configured

**Error:**
```
Cannot configure the runner because it is already configured
```

**Solution:**
```bash
cd ~/actions-runner

# Stop service
sudo ./svc.sh stop
sudo ./svc.sh uninstall

# Remove configuration (get removal token from GitHub)
./config.sh remove --token YOUR_REMOVAL_TOKEN

# Reconfigure with new token
./config.sh --url https://github.com/YOUR_USERNAME/Go-project-1st --token YOUR_NEW_TOKEN

# Reinstall service
sudo ./svc.sh install
sudo ./svc.sh start
```

---

## Maintenance & Updates

### Routine Tasks

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

# Last N lines
docker-compose -f docker-compose.prod.yml logs --tail=50 backend
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
# Manual backup
docker exec hotel_menu_db pg_dump -U postgres hotel_menu > backup_$(date +%Y%m%d).sql

# Restore from backup
docker exec -i hotel_menu_db psql -U postgres hotel_menu < backup_20260217.sql
```

#### Monitor Resources
```bash
# Container stats
docker stats

# Disk usage
df -h

# Docker disk usage
docker system df
```

#### Update System Packages
```bash
sudo apt update && sudo apt upgrade -y
sudo reboot  # If kernel updated
```

---

## Cost Management

### AWS Free Tier (First 12 Months)
- **EC2 t2.micro**: 750 hours/month FREE
- **EBS Storage**: 30 GB FREE
- **Data Transfer**: 15 GB out FREE
- **Total**: $0/month ✨

### After Free Tier
- **EC2 t2.micro**: ~$9/month
- **EBS 20GB**: ~$2/month
- **Data Transfer**: ~$1-5/month
- **Total**: ~$12-16/month

### Cost Reduction Tips
1. Stop EC2 when not in use (dev/test)
2. Use smaller EBS volumes
3. Monitor and optimize data transfer
4. Set up billing alerts

---

## Security Best Practices

1. **Change default passwords** in `.env`
2. **Restrict SSH access** to your IP only
3. **Keep system updated**: `sudo apt update && sudo apt upgrade`
4. **Enable HTTPS** with Let's Encrypt
5. **Regular backups** to S3 or external storage
6. **Monitor logs** for suspicious activity
7. **Use strong passwords** and consider password managers
8. **Set up CloudWatch** for monitoring (optional)

---

## Next Steps

After successful deployment:

1. ✅ Test all CRUD operations
2. ✅ Set up automated backups
3. ✅ Configure domain and HTTPS
4. ✅ Set up monitoring alerts
5. ✅ Document any custom configurations
6. ✅ Create staging environment
7. ✅ Implement additional features

---

## Support Resources

- **Project Documentation**: [PROJECT-DOCUMENTATION.md](PROJECT-DOCUMENTATION.md)
- **GitHub Repository**: https://github.com/YOUR_USERNAME/Go-project-1st
- **AWS Documentation**: https://docs.aws.amazon.com/
- **Docker Documentation**: https://docs.docker.com/
- **Nginx Documentation**: https://nginx.org/en/docs/

---

**🎉 Congratulations! Your Hotel Menu Manager is now live and accessible worldwide!**

For detailed technical information, see [PROJECT-DOCUMENTATION.md](PROJECT-DOCUMENTATION.md).
