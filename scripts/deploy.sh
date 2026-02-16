#!/bin/bash

# ===========================================
# EC2 Deployment Script
# ===========================================
# Run this script on your EC2 instance

set -e  # Exit on error

echo "🚀 Starting deployment..."

# Pull latest changes
echo "📦 Pulling latest code from GitHub..."
git pull origin main

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose -f docker-compose.prod.yml down

# Remove old images (optional, saves disk space)
echo "🧹 Cleaning up old images..."
docker image prune -af

# Build and start containers
echo "🏗️  Building and starting containers..."
docker-compose -f docker-compose.prod.yml up -d --build

# Wait for services to start
echo "⏳ Waiting for services to start..."
sleep 15

# Show running containers
echo "📋 Running containers:"
docker ps

# Check service health
echo "🏥 Checking service health..."

# Check database
if docker exec hotel_menu_db pg_isready -U postgres > /dev/null 2>&1; then
    echo "✅ Database is running"
else
    echo "❌ Database is not responding"
    exit 1
fi

# Check backend
if curl -f http://localhost:8080/api/foods > /dev/null 2>&1; then
    echo "✅ Backend API is running"
else
    echo "⚠️  Backend API is not responding yet (may need more time)"
fi

# Check frontend
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Frontend is running"
else
    echo "⚠️  Frontend is not responding yet (may need more time)"
fi

echo ""
echo "✨ Deployment completed!"
echo "🌐 Frontend: http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4):3000"
echo "🔌 Backend API: http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4):8080"
