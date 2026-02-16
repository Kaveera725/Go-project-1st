# 🚀 AWS EC2 Deployment Guide with CI/CD

Complete guide to deploy the Hotel Menu Manager application on AWS EC2 with automated CI/CD using GitHub Actions.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [AWS Setup](#aws-setup)
3. [EC2 Instance Setup](#ec2-instance-setup)
4. [Initial Deployment](#initial-deployment)
5. [GitHub Actions CI/CD Setup](#github-actions-cicd-setup)
6. [Verify Deployment](#verify-deployment)
7. [Troubleshooting](#troubleshooting)

---

## 🔧 Prerequisites

- AWS Account (Free Tier eligible)
- GitHub Account
- Git installed locally
- SSH client (Windows: PowerShell/CMD, Mac/Linux: Terminal)

---

## 🔑 Understanding Key Components

### What is an SSH Key Pair?

**SSH Key Pair** is like a digital lock and key for your EC2 server:
- **Private Key (.pem file):** This is YOUR key that stays on your computer. Never share it!
- **Public Key:** AWS installs this on the EC2 server automatically
- **Purpose:** Allows you to securely connect to your EC2 instance without passwords

**Important:**
- ⚠️ Download the .pem file when creating it - AWS won't let you download it again!
- 🔒 Keep it safe and never commit it to GitHub (already in .gitignore)
- 🖥️ You'll use this file every time you SSH into your EC2 instance

### What is the .env File?

**Environment Variables File (.env)** stores configuration settings:
- **Location:** Root of your project on EC2 (not in Git!)
- **Contains:** Database credentials, API URLs, secrets
- **Security:** Never commit to GitHub - it contains sensitive passwords!

**Two .env files in this project:**
1. **Local development:** `backend/.env` (for local development on your PC)
2. **Production:** `.env` (root folder on EC2 server only)

---

## ☁️ AWS Setup

### Step 1: Launch EC2 Instance

1. **Go to AWS Console** → Search for "EC2" → Click "Launch instance"

2. **Configure Instance:**
   - **Name:** `hotel-menu-server`
   - **AMI:** Ubuntu Server 24.04 LTS (Free tier eligible) ✅
   - **Instance type:** `t2.micro` (Free tier eligible)
   
3. **Key Pair (Your SSH Key):**
   - Click "Create new key pair"
   - Name: `hotel-menu-key`
   - Type: RSA
   - Format: `.pem` (recommended for all platforms)
   - **⚠️ CRITICAL: Download and save this file! You cannot download it again!**
   - **Save location:** Keep it in a safe folder (e.g., `C:\AWS-Keys\` or `~/aws-keys/`)
   - **What it's for:** This is your "password" to access the EC2 server via SSH

4. **Network Settings:**
   - Auto-assign public IP: **Enable**
   - Create security group: `hotel-menu-sg`
   
   **Add these inbound rules:**
   ```
   SSH         | Port 22   | My IP (for security)
   HTTP        | Port 80   | 0.0.0.0/0
   Custom TCP  | Port 3000 | 0.0.0.0/0  (Frontend)
   Custom TCP  | Port 8080 | 0.0.0.0/0  (Backend API)
   ```

5. **Storage:** 20 GB gp3 (for database data)

6. **Launch Instance** and wait 1-2 minutes

7. **Get Public IP:**
   - Go to EC2 → Instances → Click your instance
   - Copy the **Public IPv4 address** (e.g., `54.123.45.67`)

---

## 🖥️ EC2 Instance Setup

### Step 2: Connect to EC2 Using SSH Key

**Important Notes:**
- Replace `YOUR_EC2_PUBLIC_IP` with your actual EC2 public IP (e.g., 54.123.45.67)
- Replace `hotel-menu-key.pem` with your actual key file path
- Ubuntu Server default username is `ubuntu` (not ec2-user)

**Windows (PowerShell/CMD):**
```powershell
# Navigate to where your .pem file is saved
cd C:\AWS-Keys

# Set correct permissions (only you can read the file)
icacls hotel-menu-key.pem /inheritance:r /grant:r "%USERNAME%:R"

# Connect to EC2 (use YOUR actual IP address!)
ssh -i hotel-menu-key.pem ubuntu@YOUR_EC2_PUBLIC_IP

# Example with real IP:
# ssh -i hotel-menu-key.pem ubuntu@54.123.45.67
```

**Mac/Linux:**
```bash
# Navigate to where your .pem file is saved
cd ~/aws-keys

# Set correct permissions (required by SSH)
chmod 400 hotel-menu-key.pem

# Connect to EC2 (use YOUR actual IP address!)
ssh -i hotel-menu-key.pem ubuntu@YOUR_EC2_PUBLIC_IP

# Example with real IP:
# ssh -i hotel-menu-key.pem ubuntu@54.123.45.67
```

**First time connecting:** Type `yes` when asked "Are you sure you want to continue connecting?"

### Step 3: Install Docker & Docker Compose (Ubuntu Server)

**Run these commands on your EC2 instance after connecting via SSH:**

```bash
# Update system packages
sudo apt-get update -y
sudo apt-get upgrade -y

# Install required packages
sudo apt-get install -y docker.io docker-compose git curl

# Start Docker service
sudo systemctl start docker
sudo systemctl enable docker

# Add ubuntu user to docker group (so you can run docker without sudo)
sudo usermod -aG docker ubuntu

# Log out and log back in for group changes to take effect
exit
```

**Reconnect to EC2:**
```bash
# Windows PowerShell/CMD:
ssh -i hotel-menu-key.pem ubuntu@YOUR_EC2_PUBLIC_IP

# Mac/Linux:
ssh -i hotel-menu-key.pem ubuntu@YOUR_EC2_PUBLIC_IP
```

**Verify installations:**
```bash
docker --version
docker-compose --version
```

---

## 📦 Initial Deployment

### Step 4: Clone Repository

```bash
# Clone your GitHub repository
git clone https://github.com/YOUR_USERNAME/hotel-menu-manager.git
cd hotel-menu-manager
```

### Step 5: Configure Environment Variables (.env file)

**🔍 What are we doing?**
Creating a `.env` file in the project root on EC2 to store production configuration.

**📍 Where does this file go?**
- Location: `/home/ubuntu/hotel-menu-manager/.env` (root of project on EC2)
- **NOT** in `backend/.env` (that's for local development only)
- **NOT** committed to Git (security!)

**⚙️ Create the production .env file:**
```bash
# Make sure you're in the project directory
cd ~/hotel-menu-manager

# Create .env file using nano text editor
nano .env
```

**📝 Copy and paste this content (UPDATE the values!):**
```env
# ===========================================
# PRODUCTION ENVIRONMENT VARIABLES
# ===========================================
# This file MUST be created on EC2 server only!
# Location: /home/ubuntu/hotel-menu-manager/.env

# Database Configuration (runs in Docker)
DB_HOST=db
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=YourSecurePassword123!
DB_NAME=hotel_menu
DB_SSLMODE=disable

# Backend Server
SERVER_PORT=8080

# CORS - Frontend URLs allowed to access the API
# ⚠️ IMPORTANT: Replace YOUR_EC2_PUBLIC_IP with your actual EC2 IP!
# Example: http://54.123.45.67:3000
ALLOWED_ORIGINS=http://YOUR_EC2_PUBLIC_IP:3000

# Frontend API URL - Where frontend will call the backend
# ⚠️ IMPORTANT: Replace YOUR_EC2_PUBLIC_IP with your actual EC2 IP!
# Example: http://54.123.45.67:8080/api
VITE_API_URL=http://YOUR_EC2_PUBLIC_IP:8080/api
```

**🔐 Security Notes:**
- Change `DB_PASSWORD` to a strong password (e.g., `MyStr0ng!Pass2024`)
- Replace `YOUR_EC2_PUBLIC_IP` with your actual EC2 public IP address
- This file will be ignored by Git (already in .gitignore)

**💾 Save and exit:**
1. Press `Ctrl+X`
2. Press `Y` (yes)
3. Press `Enter` (confirm filename)

**✅ Verify the file:**
```bash
# Check if file was created
ls -la .env

# View the content (to verify)
cat .env
```

### Step 6: Deploy Application

```bash
# Make deploy script executable
chmod +x scripts/deploy.sh

# Run deployment
./scripts/deploy.sh
```

Or manually:
```bash
docker-compose -f docker-compose.prod.yml up -d --build
```

**Wait 2-3 minutes for build to complete.**

### Step 7: Check Status

```bash
# View running containers
docker ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Check specific service
docker-compose -f docker-compose.prod.yml logs backend
docker-compose -f docker-compose.prod.yml logs frontend
docker-compose -f docker-compose.prod.yml logs db
```

---

## 🔄 GitHub Actions CI/CD Setup

### Step 8: Configure GitHub Secrets

1. **Go to your GitHub repository**
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**

**Add these secrets:**

| Secret Name | Value | Description |
|------------|-------|-------------|
| `EC2_HOST` | Your EC2 Public IP | e.g., 54.123.45.67 |
| `EC2_USERNAME` | `ubuntu` | Ubuntu Server default user |
| `EC2_SSH_KEY` | Contents of `hotel-menu-key.pem` | Entire private key file (including BEGIN/END lines) |

**📋 How to copy your SSH private key (.pem file):**

**Windows (PowerShell):**
```powershell
# Navigate to where your .pem file is saved
cd C:\AWS-Keys

# Copy entire file content to clipboard
Get-Content hotel-menu-key.pem | clip

# Or open with notepad and copy manually
notepad hotel-menu-key.pem
```

**Mac:**
```bash
# Copy to clipboard
cat hotel-menu-key.pem | pbcopy
```

**Linux:**
```bash
# Display content (copy manually with mouse)
cat hotel-menu-key.pem
```

**⚠️ Must include the entire key:**
```
-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEA...
(many lines of random characters)
...xyz123==
-----END RSA PRIVATE KEY-----
```

**Important:** Copy everything from `-----BEGIN` to `-----END` including those lines!

### Step 9: Push Code with GitHub Actions

The GitHub Actions workflow is already created at `.github/workflows/deploy.yml`

**To trigger deployment:**
```bash
# Make changes to your code
git add .
git commit -m "Deploy to EC2"
git push origin main
```

**Or manually trigger:**
1. Go to GitHub repository
2. Click **Actions** tab
3. Select **Deploy to AWS EC2**
4. Click **Run workflow**

### Step 10: Monitor Deployment

1. Go to **Actions** tab in GitHub
2. Click on the latest workflow run
3. Watch the deployment logs in real-time
4. ✅ Green checkmark = successful deployment

---

## ✅ Verify Deployment

### Check Services

```bash
# On EC2, check container status
docker ps

# Should show 3 containers running:
# - hotel_menu_db (PostgreSQL)
# - hotel_menu_backend (Go API)
# - hotel_menu_frontend (React/Nginx)
```

### Test Endpoints

**Frontend:**
```
http://YOUR_EC2_PUBLIC_IP:3000
```

**Backend API:**
```
http://YOUR_EC2_PUBLIC_IP:8080/api/foods
```

**Using curl from EC2:**
```bash
# Test backend
curl http://localhost:8080/api/foods

# Test frontend
curl http://localhost:3000
```

---

## 🐛 Troubleshooting

### Issue: Cannot connect to EC2

**Solution:**
```bash
# Check security group allows SSH from your IP
# Ensure key permissions are correct
icacls hotel-menu-key.pem /inheritance:r /grant:r "%USERNAME%:R"  # Windows
chmod 400 hotel-menu-key.pem  # Mac/Linux
```

### Issue: Containers not starting

**Solution:**
```bash
# Check logs
docker-compose -f docker-compose.prod.yml logs

# Restart services
docker-compose -f docker-compose.prod.yml restart

# Rebuild from scratch
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d --build
```

### Issue: Frontend cannot connect to backend

**Solution:**
```bash
# 1. Check CORS in .env
nano .env
# Ensure ALLOWED_ORIGINS includes your EC2 IP

# 2. Check backend is running
curl http://localhost:8080/api/foods

# 3. Check security group allows port 8080

# 4. Restart backend
docker-compose -f docker-compose.prod.yml restart backend
```

### Issue: GitHub Actions deployment fails

**Solution:**
1. Check GitHub Secrets are set correctly
2. Verify EC2_SSH_KEY is the complete private key
3. Ensure EC2 security group allows SSH from GitHub IPs (or use 0.0.0.0/0)
4. Check EC2 instance is running

### Issue: Database connection errors

**Solution:**
```bash
# Check database container
docker ps | grep db

# View database logs
docker-compose -f docker-compose.prod.yml logs db

# Connect to database
docker exec -it hotel_menu_db psql -U postgres -d hotel_menu

# List tables
\dt

# Exit
\q
```

### Issue: Port already in use

**Solution:**
```bash
# Find process using port
sudo lsof -i :3000
sudo lsof -i :8080

# Kill process
sudo kill -9 <PID>

# Or stop all containers and restart
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d
```

---

## 🔧 Useful Commands

### Container Management

```bash
# View running containers
docker ps

# View all containers
docker ps -a

# Stop all services
docker-compose -f docker-compose.prod.yml down

# Start services
docker-compose -f docker-compose.prod.yml up -d

# View logs (follow mode)
docker-compose -f docker-compose.prod.yml logs -f

# Restart a service
docker-compose -f docker-compose.prod.yml restart backend

# Rebuild and restart
docker-compose -f docker-compose.prod.yml up -d --build

# Remove all stopped containers and unused images
docker system prune -a
```

### Database Commands

```bash
# Connect to PostgreSQL
docker exec -it hotel_menu_db psql -U postgres -d hotel_menu

# Inside psql:
\dt                    # List tables
\d foods              # Describe foods table
SELECT * FROM foods;  # Query data
\q                    # Quit
```

### System Monitoring

```bash
# Check disk space
df -h

# Check memory
free -h

# Check CPU and processes
top

# View Docker resource usage
docker stats
```

### Update Application

```bash
# Pull latest code
cd ~/hotel-menu-manager
git pull origin main

# Rebuild and restart
./scripts/deploy.sh
```

---

## 💰 Cost Estimate

### AWS Free Tier (First 12 months)
- ✅ EC2 t2.micro: **FREE** (750 hours/month)
- ✅ 20 GB Storage: **FREE** (30 GB included)
- ✅ Data Transfer: **FREE** (15 GB/month included)

**Total: $0/month** within Free Tier limits

### After Free Tier
- EC2 t2.micro: ~$9/month
- 20 GB Storage: ~$2/month
- Data Transfer: ~$1/month

**Total: ~$12/month**

---

## 🎉 Success!

Your Hotel Menu Manager is now deployed on AWS EC2 with automated CI/CD!

**What you have:**
- ✅ Production app running on EC2
- ✅ PostgreSQL database in Docker
- ✅ Automated deployments via GitHub Actions
- ✅ HTTPS-ready architecture (add SSL later)
- ✅ Easy to manage and update

**Next Steps:**
1. Set up a custom domain (optional)
2. Add SSL certificate with Let's Encrypt (optional)
3. Set up monitoring with CloudWatch
4. Configure automated backups for database
5. Add staging environment

---

## 📚 Resources

- [AWS EC2 Documentation](https://docs.aws.amazon.com/ec2/)
- [Docker Documentation](https://docs.docker.com/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

---

**Need help?** Check the troubleshooting section or review the logs:
```bash
docker-compose -f docker-compose.prod.yml logs -f
```
