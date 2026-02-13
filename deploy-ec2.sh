#!/bin/bash
# ===========================================
# EC2 Deployment Script for Hotel Menu Manager
# ===========================================
# Run this script on your EC2 instance after SSH-ing into it
# Prerequisites: Ubuntu/Amazon Linux EC2 instance
# Database: PostgreSQL in Docker (no AWS RDS needed)

set -e

echo "=========================================="
echo "Hotel Menu Manager - EC2 Deployment"
echo "Local PostgreSQL in Docker"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# ----- Step 1: Update system -----
echo -e "${YELLOW}[1/7] Updating system packages...${NC}"
sudo yum update -y 2>/dev/null || sudo apt-get update -y

# ----- Step 2: Install Docker -----
echo -e "${YELLOW}[2/7] Installing Docker...${NC}"
if ! command -v docker &> /dev/null; then
    # For Amazon Linux 2
    if [ -f /etc/amazon-linux-release ]; then
        sudo yum install -y docker
        sudo systemctl start docker
        sudo systemctl enable docker
        sudo usermod -aG docker $USER
    # For Ubuntu
    else
        sudo apt-get install -y apt-transport-https ca-certificates curl software-properties-common
        curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
        sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
        sudo apt-get update
        sudo apt-get install -y docker-ce docker-ce-cli containerd.io
        sudo systemctl start docker
        sudo systemctl enable docker
        sudo usermod -aG docker $USER
    fi
    echo -e "${GREEN}Docker installed successfully!${NC}"
else
    echo -e "${GREEN}Docker already installed.${NC}"
fi

# ----- Step 3: Install Docker Compose -----
echo -e "${YELLOW}[3/7] Installing Docker Compose...${NC}"
if ! command -v docker-compose &> /dev/null; then
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    echo -e "${GREEN}Docker Compose installed successfully!${NC}"
else
    echo -e "${GREEN}Docker Compose already installed.${NC}"
fi

# ----- Step 4: Install Git -----
echo -e "${YELLOW}[4/7] Installing Git...${NC}"
if ! command -v git &> /dev/null; then
    sudo yum install -y git 2>/dev/null || sudo apt-get install -y git
    echo -e "${GREEN}Git installed successfully!${NC}"
else
    echo -e "${GREEN}Git already installed.${NC}"
fi

# ----- Step 5: Clone/Pull Repository -----
echo -e "${YELLOW}[5/7] Setting up project repository...${NC}"
PROJECT_DIR="$HOME/hotel-menu-manager"
REPO_URL="${GITHUB_REPO_URL:-https://github.com/YOUR_USERNAME/YOUR_REPO.git}"

if [ ! -d "$PROJECT_DIR" ]; then
    echo "Cloning repository..."
    git clone "$REPO_URL" "$PROJECT_DIR"
else
    echo "Pulling latest changes..."
    cd "$PROJECT_DIR"
    git pull origin main
fi

cd "$PROJECT_DIR"

# ----- Step 6: Configure Environment -----
echo -e "${YELLOW}[6/7] Configuring environment...${NC}"
if [ ! -f ".env" ]; then
    echo -e "${RED}ERROR: .env file not found!${NC}"
    echo "Please create a .env file with your configuration:"
    echo ""
    echo "  DB_HOST=db"
    echo "  DB_PORT=5432"
    echo "  DB_USER=postgres"
    echo "  DB_PASSWORD=your-secure-password"
    echo "  DB_NAME=hotel_menu"
    echo "  DB_SSLMODE=disable"
    echo "  ALLOWED_ORIGINS=http://YOUR_EC2_PUBLIC_IP:3000"
    echo ""
    echo "You can copy from .env.example:"
    echo "  cp .env.example .env"
    echo "  nano .env"
    echo ""
    echo "Note: Database will run in Docker container, no RDS needed!"
    exit 1
fi

echo -e "${GREEN}Environment configured!${NC}"

# ----- Step 7: Build and Deploy -----
echo -e "${YELLOW}[7/7] Building and deploying containers...${NC}"
docker-compose -f docker-compose.prod.yml down 2>/dev/null || true

# Build and start containers
docker-compose -f docker-compose.prod.yml up -d --build

echo ""
echo "=========================================="
echo -e "${GREEN}Deployment Complete!${NC}"
echo "=========================================="
echo ""
echo "Your application is now running:"
echo "  - Frontend: http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4):3000"
echo "  - Backend API: http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4):8080/api"
echo "  - Database: PostgreSQL in Docker (local)"
echo ""
echo "To view logs:"
echo "  docker-compose -f docker-compose.prod.yml logs -f"
echo ""
echo "To stop the application:"
echo "  docker-compose -f docker-compose.prod.yml down"
echo ""
echo "Database is automatically initialized with schema and seed data!
echo "To stop the application:"
echo "  sudo docker-compose -f docker-compose.prod.yml down"
echo ""
