#!/bin/bash

# ===========================================
# Quick Setup Script for EC2 (Ubuntu Server)
# ===========================================
# Run this after first SSH into EC2

set -e

echo "🚀 Setting up EC2 instance for Hotel Menu Manager..."

# Update system
echo "📦 Updating system packages..."
sudo apt-get update -y
sudo apt-get upgrade -y

# Install Docker, Docker Compose, and Git
echo "🐳 Installing Docker, Docker Compose, and Git..."
sudo apt-get install -y docker.io docker-compose git curl

# Start Docker
echo "▶️  Starting Docker service..."
sudo systemctl start docker
sudo systemctl enable docker

# Add user to docker group
echo "👤 Adding user to docker group..."
sudo usermod -aG docker ubuntu

echo ""
echo "✅ Setup complete!"
echo ""
echo "⚠️  IMPORTANT: Log out and log back in to apply docker group changes"
echo ""
echo "Next steps:"
echo "1. Exit and reconnect: exit"
echo "2. ssh -i hotel-menu-key.pem ubuntu@YOUR_EC2_IP"
echo "3. Clone repository: git clone https://github.com/YOUR_USERNAME/hotel-menu-manager.git"
echo "4. cd hotel-menu-manager"
echo "5. Create .env file: nano .env (copy from .env.example and update values)"
echo "6. Run: ./scripts/deploy.sh"
