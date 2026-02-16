# 🚀 Quick Reference - EC2 Deployment & CI/CD

## 🔑 Important Files Explained

### SSH Key Pair (.pem file)
**What:** Your digital "key" to access EC2 server  
**File:** `hotel-menu-key.pem` (download from AWS when creating EC2)  
**Location:** Save on your PC (e.g., `C:\AWS-Keys\` or `~/aws-keys/`)  
**Used for:** SSH connection to EC2, GitHub Actions deployment  
**Security:** ⚠️ Never share, never commit to Git!

### Environment Variables (.env)
**What:** Configuration file with passwords, URLs, settings  
**Two different files:**

1. **Local Development:** `backend/.env`
   - Location: Your PC at `backend/.env`
   - Used for: Running project locally on your computer
   - Contains: `DB_HOST=localhost`

2. **Production (EC2):** `.env` 
   - Location: EC2 at `/home/ubuntu/hotel-menu-manager/.env`
   - Used for: Running project on EC2 server
   - Contains: `DB_HOST=db` and your EC2 IP addresses
   - **⚠️ Create this ONLY on EC2, NOT on your PC!**

**Security:** Both are in .gitignore - never committed to GitHub!

---

## 📝 Deployment Checklist

### Initial Setup (One-time)
- [ ] Launch EC2 instance (t2.micro, Ubuntu Server 24.04 LTS)
- [ ] Configure security group (ports 22, 80, 3000, 8080)
- [ ] Create and download `.pem` key file (save it safely!)
- [ ] Connect to EC2 via SSH using your .pem key
- [ ] Install Docker, Docker Compose, and Git on EC2
- [ ] Log out and reconnect to EC2
- [ ] Clone GitHub repository on EC2
- [ ] **Create `.env` file in project root on EC2** (see .env section below)
- [ ] Update `.env` with your EC2 public IP
- [ ] Run initial deployment: `./scripts/deploy.sh`
- [ ] Verify deployment: Check frontend and backend URLs

### GitHub Actions Setup (One-time)
- [ ] Create GitHub repository
- [ ] Push your code to GitHub
- [ ] Add GitHub Secrets (Settings → Secrets and variables → Actions):
  - `EC2_HOST` = Your EC2 Public IP (e.g., 54.123.45.67)
  - `EC2_USERNAME` = `ubuntu` (for Ubuntu Server)
  - `EC2_SSH_KEY` = Complete contents of your `hotel-menu-key.pem` file
- [ ] Verify `.github/workflows/deploy.yml` exists in your repo
- [ ] Push code to trigger first deployment

### Every Deployment
- [ ] Make code changes locally
- [ ] Commit and push to `main` branch
- [ ] GitHub Actions automatically deploys
- [ ] Verify deployment in Actions tab

---

## 🔗 Essential URLs

Replace `YOUR_EC2_IP` with your actual EC2 public IP address:

**Find your EC2 IP:** AWS Console → EC2 → Instances → Select your instance → Copy "Public IPv4 address"

- **Frontend (Web UI):** `http://YOUR_EC2_IP:3000`  
  Example: `http://54.123.45.67:3000`
  
- **Backend API:** `http://YOUR_EC2_IP:8080/api/foods`  
  Example: `http://54.123.45.67:8080/api/foods`
  
- **GitHub Actions:** `https://github.com/YOUR_USERNAME/hotel-menu-manager/actions`

---

## 💻 Common Commands

### On Your Local Machine (Your PC)

```bash
# Connect to EC2 (use YOUR .pem file location and EC2 IP!)
# Windows PowerShell/CMD:
ssh -i C:\AWS-Keys\hotel-menu-key.pem ubuntu@YOUR_EC2_IP

# Mac/Linux:
ssh -i ~/aws-keys/hotel-menu-key.pem ubuntu@YOUR_EC2_IP

# Example with real IP:
# ssh -i hotel-menu-key.pem ubuntu@54.123.45.67

# Push code (triggers auto-deployment via GitHub Actions)
git add .
git commit -m "Your message"
git push origin main
```

### On EC2 Instance

```bash
# Deploy/Update application
cd ~/hotel-menu-manager
./scripts/deploy.sh

# Manual deployment
docker-compose -f docker-compose.prod.yml up -d --build

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Check running containers
docker ps

# Stop all services
docker-compose -f docker-compose.prod.yml down

# Restart a service
docker-compose -f docker-compose.prod.yml restart backend

# Clean up Docker
docker system prune -a

# Pull latest code
git pull origin main

# View real-time logs
docker-compose -f docker-compose.prod.yml logs -f backend
```

### Database Commands

```bash
# Connect to database
docker exec -it hotel_menu_db psql -U postgres -d hotel_menu

# Inside psql
\dt                    # List all tables
\d foods              # Describe foods table
SELECT * FROM foods;  # Query all food items
SELECT COUNT(*) FROM foods;  # Count records
\q                    # Exit psql
```

---

## 🐛 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Can't SSH to EC2 | Check security group allows your IP on port 22 |
| Services not starting | `docker-compose -f docker-compose.prod.yml logs` |
| Frontend can't reach backend | Check CORS in `.env` file, restart backend |
| Database errors | `docker-compose -f docker-compose.prod.yml logs db` |
| Port already in use | `sudo lsof -i :PORT` then `sudo kill -9 PID` |
| Out of disk space | `docker system prune -a` |
| GitHub Actions fails | Check GitHub Secrets are set correctly |

---

## 📁 Important Files

| File | Purpose |
|------|---------|
| `.github/workflows/deploy.yml` | GitHub Actions CI/CD workflow |
| `docker-compose.prod.yml` | Production Docker configuration |
| `scripts/deploy.sh` | Automated deployment script |
| `scripts/ec2-setup.sh` | Initial EC2 setup script |
| `.env` | Environment variables (EC2 only, not in Git) |
| `backend/.env` | Local development env (not in Git) |

---

## 🔐 GitHub Secrets (Required for CI/CD)

**Where to add:** GitHub Repository → Settings → Secrets and variables → Actions → New repository secret

| Secret Name | Value | Example / Notes |
|------------|-------|------|
| `EC2_HOST` | EC2 Public IP address | `54.123.45.67` |
| `EC2_USERNAME` | SSH username | `ubuntu` (for Ubuntu Server) |
| `EC2_SSH_KEY` | Complete .pem file content | Include `-----BEGIN RSA PRIVATE KEY-----` to `-----END RSA PRIVATE KEY-----` |

**How to get .pem file contents:**

**Windows PowerShell:**
```powershell
cd C:\AWS-Keys
Get-Content hotel-menu-key.pem | clip  # Copies to clipboard
# Or: notepad hotel-menu-key.pem  # Opens in Notepad
```

**Mac:**
```bash
cat ~/aws-keys/hotel-menu-key.pem | pbcopy  # Copies to clipboard
```

**Linux:**
```bash
cat ~/aws-keys/hotel-menu-key.pem  # Display to copy manually
```

---

## 🎯 Deployment Flow

```
1. Developer commits code
   ↓
2. Push to GitHub main branch
   ↓
3. GitHub Actions triggered automatically
   ↓
4. Actions SSH into EC2
   ↓
5. Pull latest code
   ↓
6. Stop old containers
   ↓
7. Build new images
   ↓
8. Start new containers
   ↓
9. Verify deployment
   ↓
10. ✅ Live!
```

---

## 📊 Health Checks

```bash
# Check all services
docker ps

# Test backend API
curl http://localhost:8080/api/foods

# Test frontend
curl http://localhost:3000

# Check database
docker exec hotel_menu_db pg_isready -U postgres

# View resource usage
docker stats
```

---

## 💰 Free Tier Limits

- **EC2 t2.micro:** 750 hours/month (always on = ~720 hours)
- **Storage:** 30 GB included
- **Data Transfer:** 15 GB/month out

**Tip:** Stop EC2 when not needed to save hours!

---

## 🆘 Need Help?

1. Check logs: `docker-compose -f docker-compose.prod.yml logs -f`
2. Check GitHub Actions logs in Actions tab
3. Check this reference: `EC2-DEPLOYMENT-STEPS.md`
4. SSH to EC2 and run diagnostics

---

## 🔄 Update Workflow

```bash
# Local changes → Push → Auto-deploy!
git add .
git commit -m "Update feature"
git push origin main

# Or manually trigger in GitHub:
# Actions → Deploy to AWS EC2 → Run workflow
```

---

---

## 🔑 SSH Key & .env File Details

### SSH Key Usage

**Your SSH Key (.pem file) is used in 3 places:**

1. **Manual SSH Connection (You → EC2)**
   ```bash
   ssh -i hotel-menu-key.pem ubuntu@YOUR_EC2_IP
   ```

2. **GitHub Secret (GitHub Actions → EC2)**
   - Secret name: `EC2_SSH_KEY`
   - Value: Complete .pem file contents
   - Allows GitHub to deploy to your EC2

3. **Security**
   - ⚠️ Keep it safe on your computer
   - ⚠️ Never commit to GitHub (.gitignore protects you)
   - ⚠️ If lost, create new key pair and update EC2

### .env File - Production (EC2)

**Where:** `/home/ubuntu/hotel-menu-manager/.env` (project root on EC2)  
**When to create:** After cloning repo on EC2, before first deployment  
**How to create:**
```bash
cd ~/hotel-menu-manager
nano .env
```

**Required content (update YOUR_EC2_PUBLIC_IP):**
```env
# Database (Docker container on EC2)
DB_HOST=db
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=YourSecurePassword123!
DB_NAME=hotel_menu
DB_SSLMODE=disable

# Backend
SERVER_PORT=8080

# Frontend CORS - Replace with your actual EC2 IP!
ALLOWED_ORIGINS=http://YOUR_EC2_PUBLIC_IP:3000

# Frontend API URL - Replace with your actual EC2 IP!
VITE_API_URL=http://YOUR_EC2_PUBLIC_IP:8080/api
```

**Example with real IP (54.123.45.67):**
```env
ALLOWED_ORIGINS=http://54.123.45.67:3000
VITE_API_URL=http://54.123.45.67:8080/api
```

**⚠️ Important:**
- Use `DB_HOST=db` (NOT `localhost`) - this is the Docker container name
- Change `DB_PASSWORD` to something secure
- This file is NOT committed to Git
- If you restart EC2 or get new public IP, update this file

---

**Last Updated:** 2026-02-16
