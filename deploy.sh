#!/bin/bash

# Cafe Kiosk Deployment Script for EC2
# This script automates the deployment process

set -e  # Exit on error

echo "======================================"
echo "Cafe Kiosk Deployment Script"
echo "======================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="cafe-kiosk"
BACKEND_DIR="backend"
FRONTEND_DIR="frontend"
DEPLOY_USER="ubuntu"
BACKEND_PORT=8080
FRONTEND_PORT=80

echo -e "${YELLOW}Step 1: Building Backend...${NC}"
cd $BACKEND_DIR
mvn clean package -DskipTests
echo -e "${GREEN}✓ Backend build complete${NC}"

echo -e "${YELLOW}Step 2: Building Frontend...${NC}"
cd ../$FRONTEND_DIR
npm install
npm run build
echo -e "${GREEN}✓ Frontend build complete${NC}"

echo -e "${YELLOW}Step 3: Stopping existing backend service...${NC}"
cd ..
sudo systemctl stop $APP_NAME-backend || true

echo -e "${YELLOW}Step 4: Deploying backend...${NC}"
sudo cp $BACKEND_DIR/target/*.jar /opt/$APP_NAME/backend.jar
sudo systemctl start $APP_NAME-backend
echo -e "${GREEN}✓ Backend deployed and started${NC}"

echo -e "${YELLOW}Step 5: Deploying frontend...${NC}"
sudo rm -rf /var/www/$APP_NAME/*
sudo cp -r $FRONTEND_DIR/dist/* /var/www/$APP_NAME/
sudo systemctl reload nginx
echo -e "${GREEN}✓ Frontend deployed${NC}"

echo -e "${GREEN}======================================"
echo -e "Deployment Complete!"
echo -e "======================================${NC}"
echo -e "Backend: http://localhost:$BACKEND_PORT"
echo -e "Frontend: http://YOUR_EC2_IP"
echo -e ""
echo -e "Check logs:"
echo -e "  Backend: sudo journalctl -u $APP_NAME-backend -f"
echo -e "  Nginx: sudo tail -f /var/log/nginx/error.log"
