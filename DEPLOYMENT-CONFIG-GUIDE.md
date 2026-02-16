# 🔐 Configuration Guide - SSH Keys & Environment Variables

This guide explains the key files needed for EC2 deployment and how to use them.

---

## 📁 Project Structure Overview

```
Your Computer (Local):
├── hotel-menu-key.pem          ← SSH key (keep safe, never commit!)
├── backend/.env                 ← Local development only
└── hotel-menu-manager/          ← Your project code
    ├── .github/workflows/
    │   └── deploy.yml           ← GitHub Actions
    └── scripts/
        └── deploy.sh

EC2 Server (Production):
└── /home/ubuntu/
    └── hotel-menu-manager/
        ├── .env                 ← Production config (create this!)
        ├── docker-compose.prod.yml
        └── scripts/
            └── deploy.sh
```

---

## 🔑 Part 1: SSH Key Pair (.pem file)

### What is it?
Your **SSH key pair** is like a digital lock and key system:
- **Private Key (.pem file):** Stays on YOUR computer - this is YOUR secret key
- **Public Key:** AWS automatically puts this on your EC2 server
- **Purpose:** Allows secure access without passwords

### Where to get it?
1. **When creating EC2 instance:** AWS asks you to create or choose a key pair
2. **Download:** You get `hotel-menu-key.pem` file (or whatever name you chose)
3. **⚠️ CRITICAL:** You can only download once! Save it somewhere safe!

### Where to save it?
**Recommended locations:**

**Windows:**
```
C:\AWS-Keys\hotel-menu-key.pem
C:\Users\YourName\.ssh\hotel-menu-key.pem
```

**Mac/Linux:**
```
~/aws-keys/hotel-menu-key.pem
~/.ssh/hotel-menu-key.pem
```

### How to use it?

#### 1. For Manual SSH Connection (Your PC → EC2)

**Windows PowerShell/CMD:**
```powershell
# Set permissions (required first time)
icacls C:\AWS-Keys\hotel-menu-key.pem /inheritance:r /grant:r "%USERNAME%:R"

# Connect to EC2
ssh -i C:\AWS-Keys\hotel-menu-key.pem ubuntu@54.123.45.67
```

**Mac/Linux:**
```bash
# Set permissions (required first time)
chmod 400 ~/aws-keys/hotel-menu-key.pem

# Connect to EC2
ssh -i ~/aws-keys/hotel-menu-key.pem ubuntu@54.123.45.67
```

#### 2. For GitHub Actions (GitHub → EC2)

**Copy the entire key content:**

**Windows PowerShell:**
```powershell
cd C:\AWS-Keys
Get-Content hotel-menu-key.pem | clip
# Or open in Notepad:
notepad hotel-menu-key.pem
```

**Mac:**
```bash
cat ~/aws-keys/hotel-menu-key.pem | pbcopy
```

**Linux:**
```bash
cat ~/aws-keys/hotel-menu-key.pem
# Copy manually with mouse
```

**Add to GitHub:**
1. Go to: GitHub Repository → Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Name: `EC2_SSH_KEY`
4. Value: Paste the ENTIRE content including:
```
-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEA...
(many lines)
...xyz==
-----END RSA PRIVATE KEY-----
```

### Security Rules
- ✅ Keep `.pem` file on your computer only
- ✅ Already in `.gitignore` - won't be committed
- ❌ NEVER share your private key
- ❌ NEVER commit to GitHub
- ❌ NEVER email or message to anyone
- ⚠️ If lost: Create new key pair in AWS, update EC2, update GitHub secret

---

## ⚙️ Part 2: Environment Variables (.env files)

### Why TWO different .env files?

Your project has **TWO separate environments:**

1. **Local Development** (your PC)
   - You're coding and testing on your computer
   - Database runs on localhost (your PC)
   
2. **Production** (EC2 server)
   - App runs on AWS in the cloud
   - Database runs in Docker container

Each needs different configuration!

---

### File 1: `backend/.env` (Local Development Only)

**Location:** `backend/.env` on your PC

**Purpose:** Used when running the project on your computer for development

**Content:**
```env
# Backend Environment Variables (LOCAL DEVELOPMENT)
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=hotel_menu
DB_SSLMODE=disable
SERVER_PORT=8080

# Frontend URLs for CORS (comma-separated)
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174,http://localhost:3000
```

**When to use:**
- When you run `go run main.go` locally
- When testing on your PC
- **NOT** used on EC2 server

---

### File 2: `.env` (Production on EC2)

**Location:** `/home/ubuntu/hotel-menu-manager/.env` (root of project on EC2)

**Purpose:** Used when running the project on EC2 server in production

**⚠️ Important:** This file does NOT exist by default - **YOU must create it on EC2!**

#### How to create it:

**Step 1: Connect to EC2**
```bash
ssh -i hotel-menu-key.pem ubuntu@YOUR_EC2_IP
```

**Step 2: Navigate to project**
```bash
cd ~/hotel-menu-manager
```

**Step 3: Create the file**
```bash
nano .env
```

**Step 4: Add this content (UPDATE the values!)**
```env
# ===========================================
# PRODUCTION ENVIRONMENT VARIABLES
# ===========================================
# Location: /home/ubuntu/hotel-menu-manager/.env
# This file must be created manually on EC2!

# Database Configuration
# IMPORTANT: Use 'db' not 'localhost' - this is Docker container name!
DB_HOST=db
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=MySecurePassword2024!
DB_NAME=hotel_menu
DB_SSLMODE=disable

# Backend Server
SERVER_PORT=8080

# CORS - Frontend URLs allowed to access the API
# ⚠️ REPLACE with your actual EC2 public IP address!
# Example: http://54.123.45.67:3000
ALLOWED_ORIGINS=http://YOUR_EC2_PUBLIC_IP:3000

# Frontend API URL - Where frontend will call the backend
# ⚠️ REPLACE with your actual EC2 public IP address!
# Example: http://54.123.45.67:8080/api
VITE_API_URL=http://YOUR_EC2_PUBLIC_IP:8080/api
```

**Step 5: Save and exit**
- Press `Ctrl+X`
- Press `Y` (yes to save)
- Press `Enter` (confirm filename)

**Step 6: Verify**
```bash
# Check file exists
ls -la .env

# View content
cat .env
```

#### Example with Real Values:

If your EC2 public IP is `54.123.45.67`:

```env
DB_HOST=db
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=MyStr0ng!Password123
DB_NAME=hotel_menu
DB_SSLMODE=disable
SERVER_PORT=8080
ALLOWED_ORIGINS=http://54.123.45.67:3000
VITE_API_URL=http://54.123.45.67:8080/api
```

---

## 🔍 Key Differences Explained

### Why `DB_HOST=localhost` vs `DB_HOST=db`?

**Local Development (`backend/.env`):**
```env
DB_HOST=localhost
```
- PostgreSQL installed on your PC
- Backend connects to database on same machine
- Uses `localhost` or `127.0.0.1`

**Production EC2 (`.env`):**
```env
DB_HOST=db
```
- PostgreSQL runs in Docker container named `db`
- Backend connects via Docker network
- Uses container name, not localhost!

### Why different ALLOWED_ORIGINS?

**Local Development:**
```env
ALLOWED_ORIGINS=http://localhost:5173
```
- Frontend runs on your PC (Vite dev server)
- Uses localhost port 5173

**Production EC2:**
```env
ALLOWED_ORIGINS=http://54.123.45.67:3000
```
- Frontend runs on EC2 public IP
- Uses port 3000 (Nginx)
- **Must match your actual EC2 IP!**

---

## 📋 Deployment Checklist

### Before Deployment:

- [ ] **SSH Key saved safely** on your computer
- [ ] **SSH Key added** to GitHub Secrets (`EC2_SSH_KEY`)
- [ ] **EC2 HOST added** to GitHub Secrets (`EC2_HOST`)
- [ ] **EC2 USERNAME added** to GitHub Secrets (`EC2_USERNAME` = `ubuntu`)
- [ ] **Connected to EC2** at least once manually
- [ ] **Created `.env`** file in project root on EC2
- [ ] **Updated `.env`** with your actual EC2 public IP
- [ ] **Changed database password** in `.env` to something secure

### After Creating `.env` on EC2:

```bash
# Deploy the application
cd ~/hotel-menu-manager
./scripts/deploy.sh

# Or manually:
docker-compose -f docker-compose.prod.yml up -d --build
```

---

## ❓ Common Questions

### Q: Where do I put the .pem file?
**A:** Save it on your computer in a safe location:
- Windows: `C:\AWS-Keys\hotel-menu-key.pem`
- Mac/Linux: `~/aws-keys/hotel-menu-key.pem`
- **Never** copy it to EC2 server
- **Never** commit it to Git

### Q: Do I need to create `.env` on my PC?
**A:** You have TWO `.env` files:
1. `backend/.env` - Already exists for local development
2. `.env` (root) - Create manually on EC2 server only

### Q: What if I change my EC2 IP?
**A:** Update these files:
1. `.env` on EC2: Update `ALLOWED_ORIGINS` and `VITE_API_URL`
2. GitHub Secret: Update `EC2_HOST` with new IP
3. Restart containers: `docker-compose -f docker-compose.prod.yml restart`

### Q: Is my password safe in `.env`?
**A:** Yes, because:
- `.env` is in `.gitignore` (never committed to GitHub)
- Only exists on EC2 server with proper security groups
- Only you can SSH into EC2 (with your private key)

### Q: Can I use the same .env locally and on EC2?
**A:** No! They need different values:
- Local: `DB_HOST=localhost`, `ALLOWED_ORIGINS=http://localhost:5173`
- EC2: `DB_HOST=db`, `ALLOWED_ORIGINS=http://YOUR_EC2_IP:3000`

---

## 🆘 Troubleshooting

### Problem: SSH permission denied

```bash
# Windows: Fix permissions
icacls hotel-menu-key.pem /inheritance:r /grant:r "%USERNAME%:R"

# Mac/Linux: Fix permissions
chmod 400 hotel-menu-key.pem
```

### Problem: Can't find EC2 public IP

1. Go to AWS Console
2. EC2 → Instances
3. Click your instance
4. Copy "Public IPv4 address"

### Problem: Containers can't connect to database

**Check `.env` on EC2:**
```bash
cd ~/hotel-menu-manager
cat .env
```

Make sure it has:
```env
DB_HOST=db    # NOT localhost!
```

### Problem: Frontend can't connect to backend (CORS error)

**Check `.env` on EC2:**
```env
ALLOWED_ORIGINS=http://YOUR_EC2_IP:3000
```

Must use your **actual EC2 public IP**, not `localhost`!

**Restart backend:**
```bash
docker-compose -f docker-compose.prod.yml restart backend
```

---

## 📚 Summary

| Item | Location | Purpose | Security |
|------|----------|---------|----------|
| `hotel-menu-key.pem` | Your PC | SSH access to EC2 | Never share, never commit |
| `backend/.env` | Your PC | Local development | In .gitignore |
| `.env` | EC2 server root | Production config | In .gitignore, create on EC2 only |
| GitHub Secret `EC2_SSH_KEY` | GitHub | CI/CD deployment | Private to repository |
| GitHub Secret `EC2_HOST` | GitHub | Your EC2 IP | Public IP address |
| GitHub Secret `EC2_USERNAME` | GitHub | SSH username | Always `ubuntu` for Ubuntu Server |

---

**Need more help?** Check:
- [EC2-DEPLOYMENT-STEPS.md](EC2-DEPLOYMENT-STEPS.md) - Complete deployment guide
- [QUICK-REFERENCE.md](QUICK-REFERENCE.md) - Quick command reference
