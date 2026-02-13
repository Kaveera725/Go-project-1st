@echo off
REM ===========================================
REM Hotel Menu Manager - AWS Deployment Setup
REM ===========================================
REM This batch file helps you deploy the project to AWS EC2 with RDS PostgreSQL
REM Run this on your Windows machine before deploying to EC2

setlocal enabledelayedexpansion

echo.
echo ==========================================
echo Hotel Menu Manager - AWS Deployment Setup
echo ==========================================
echo.

:MENU
echo Choose an option:
echo.
echo   1. Setup AWS RDS PostgreSQL (Create database)
echo   2. Initialize database schema on RDS
echo   3. Push code to GitHub
echo   4. Generate EC2 user-data script
echo   5. Connect to EC2 via SSH
echo   6. Local test with Docker (uses local PostgreSQL)
echo   7. Exit
echo.
set /p choice=Enter your choice (1-7): 

if "%choice%"=="1" goto SETUP_RDS
if "%choice%"=="2" goto INIT_DB
if "%choice%"=="3" goto PUSH_GITHUB
if "%choice%"=="4" goto GENERATE_USERDATA
if "%choice%"=="5" goto SSH_EC2
if "%choice%"=="6" goto LOCAL_TEST
if "%choice%"=="7" goto END
echo Invalid choice. Please try again.
goto MENU

REM ===========================================
:SETUP_RDS
REM ===========================================
echo.
echo ==========================================
echo Step 1: AWS RDS PostgreSQL Setup Guide
echo ==========================================
echo.
echo Follow these steps in AWS Console:
echo.
echo 1. Go to AWS Console ^> RDS ^> Create database
echo 2. Choose "Standard create"
echo 3. Engine: PostgreSQL
echo 4. Version: PostgreSQL 16 or later
echo 5. Templates: Free tier (for testing) or Production
echo 6. Settings:
echo    - DB instance identifier: hotel-menu-db
echo    - Master username: postgres
echo    - Master password: [your-secure-password]
echo 7. Instance configuration: db.t3.micro (Free tier)
echo 8. Storage: 20 GB gp2
echo 9. Connectivity:
echo    - VPC: Default VPC
echo    - Public access: Yes (for development)
echo    - VPC security group: Create new
echo 10. Additional configuration:
echo    - Initial database name: hotel_menu
echo 11. Click "Create database"
echo.
echo IMPORTANT: After creation, note down:
echo   - Endpoint: your-db.xxxxx.region.rds.amazonaws.com
echo   - Port: 5432
echo.
echo Update your .env file with these values!
echo.
pause
goto MENU

REM ===========================================
:INIT_DB
REM ===========================================
echo.
echo ==========================================
echo Step 2: Initialize Database Schema on RDS
echo ==========================================
echo.
echo Prerequisites:
echo   - PostgreSQL client (psql) installed
echo   - RDS endpoint and credentials ready
echo.
set /p RDS_HOST=Enter RDS Endpoint: 
set /p RDS_USER=Enter RDS Username (default: postgres): 
if "%RDS_USER%"=="" set RDS_USER=postgres
set /p RDS_DB=Enter Database Name (default: hotel_menu): 
if "%RDS_DB%"=="" set RDS_DB=hotel_menu
echo.
echo Enter RDS Password when prompted...
echo.

echo Running schema.sql...
psql -h %RDS_HOST% -U %RDS_USER% -d %RDS_DB% -f database\schema.sql

echo Running seed.sql...
psql -h %RDS_HOST% -U %RDS_USER% -d %RDS_DB% -f database\seed.sql

echo.
echo Database initialized successfully!
echo.
pause
goto MENU

REM ===========================================
:PUSH_GITHUB
REM ===========================================
echo.
echo ==========================================
echo Step 3: Push Code to GitHub
echo ==========================================
echo.
echo Initializing git and pushing to GitHub...
echo.

if not exist .git (
    echo Initializing git repository...
    git init
    git branch -M main
)

set /p REPO_URL=Enter your GitHub repository URL (e.g., https://github.com/username/repo.git): 

echo.
echo Adding remote origin...
git remote remove origin 2>nul
git remote add origin %REPO_URL%

echo.
echo Adding all files...
git add .

echo.
set /p COMMIT_MSG=Enter commit message (default: "Initial AWS deployment setup"): 
if "%COMMIT_MSG%"=="" set COMMIT_MSG=Initial AWS deployment setup

git commit -m "%COMMIT_MSG%"

echo.
echo Pushing to GitHub...
git push -u origin main

echo.
echo Code pushed to GitHub successfully!
echo.
pause
goto MENU

REM ===========================================
:GENERATE_USERDATA
REM ===========================================
echo.
echo ==========================================
echo Step 4: EC2 User Data Script
echo ==========================================
echo.
echo Copy this script to EC2 User Data when launching instance:
echo.
echo #!/bin/bash
echo yum update -y
echo yum install -y docker git
echo systemctl start docker
echo systemctl enable docker
echo usermod -aG docker ec2-user
echo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
echo chmod +x /usr/local/bin/docker-compose
echo.
echo ==========================================
echo After EC2 launches, SSH into it and run:
echo ==========================================
echo.
echo   git clone YOUR_GITHUB_REPO_URL ~/hotel-menu-manager
echo   cd ~/hotel-menu-manager
echo   cp .env.example .env
echo   nano .env  # Update with your RDS credentials
echo   chmod +x deploy-ec2.sh
echo   ./deploy-ec2.sh
echo.
pause
goto MENU

REM ===========================================
:SSH_EC2
REM ===========================================
echo.
echo ==========================================
echo Step 5: Connect to EC2 via SSH
echo ==========================================
echo.
set /p KEY_PATH=Enter path to your .pem key file: 
set /p EC2_IP=Enter EC2 Public IP: 
set /p EC2_USER=Enter EC2 username (default: ec2-user): 
if "%EC2_USER%"=="" set EC2_USER=ec2-user

echo.
echo Connecting to EC2...
ssh -i "%KEY_PATH%" %EC2_USER%@%EC2_IP%

goto MENU

REM ===========================================
:LOCAL_TEST
REM ===========================================
echo.
echo ==========================================
echo Step 6: Local Testing with Docker
echo ==========================================
echo.
echo Starting local environment with Docker Compose...
echo This uses the local PostgreSQL container.
echo.

docker-compose up -d --build

echo.
echo Local environment started!
echo   - Frontend: http://localhost:3000
echo   - Backend: http://localhost:8080/api
echo   - Database: localhost:5432
echo.
echo To stop: docker-compose down
echo.
pause
goto MENU

:END
echo.
echo Goodbye!
endlocal
