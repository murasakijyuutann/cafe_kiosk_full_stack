# EC2 Deployment Troubleshooting Guide

This guide helps you diagnose and fix common issues when deploying or updating your cafe kiosk application on EC2.

---

## Table of Contents

1. [Git Pull Issues](#git-pull-issues)
2. [Frontend Build Errors](#frontend-build-errors)
3. [Backend Build Errors](#backend-build-errors)
4. [Service Not Starting](#service-not-starting)
5. [Application Not Loading in Browser](#application-not-loading-in-browser)
6. [API Connection Issues](#api-connection-issues)
7. [Database Connection Issues](#database-connection-issues)
8. [Permission Errors](#permission-errors)

---

## Git Pull Issues

### Problem: Git pull fails with merge conflicts

**Error Message:**
```
error: Your local changes to the following files would be overwritten by merge
```

**Solution:**

```bash
# Option 1: Stash your local changes (save for later)
git stash
git pull origin main
git stash pop  # Reapply your changes

# Option 2: Discard local changes (use with caution!)
git reset --hard HEAD
git pull origin main
```

### Problem: Authentication failed when pulling from private repository

**Solution:**

```bash
# Set up SSH key or use personal access token
# For HTTPS with token:
git remote set-url origin https://YOUR_TOKEN@github.com/username/repo.git
```

---

## Frontend Build Errors

### Problem: `Cannot find module @rollup/rollup-linux-x64-gnu`

**Error Message:**
```
Error: Cannot find module @rollup/rollup-linux-x64-gnu
```

**Solution:**

```bash
cd ~/cafe_kiosk_full_stack/frontend

# Remove node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Clear npm cache
npm cache clean --force

# Reinstall dependencies
npm install

# Try building again
npm run build
```

### Problem: Build runs out of memory

**Error Message:**
```
FATAL ERROR: Ineffective mark-compacts near heap limit
```

**Solution:**

```bash
# Increase Node.js memory limit
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

### Problem: TypeScript errors during build

**Solution:**

```bash
# Check for TypeScript errors
npm run build

# If errors persist, check the specific files mentioned
# Fix TypeScript errors in your local code, commit, and push again
```

---

## Backend Build Errors

### Problem: Maven build fails

**Error Message:**
```
[ERROR] Failed to execute goal
```

**Solution:**

```bash
cd ~/cafe_kiosk_full_stack/backend

# Clean and rebuild
mvn clean package -DskipTests

# If still failing, check Java version
java -version  # Should be Java 21

# Update Java if needed
sudo apt update
sudo apt install openjdk-21-jdk -y
```

### Problem: Tests failing during build

**Solution:**

```bash
# Skip tests during build
mvn clean package -DskipTests

# Or run tests separately to see what's failing
mvn test
```

---

## Service Not Starting

### Problem: Backend service fails to start

**Check service status:**

```bash
sudo systemctl status cafe-kiosk-backend
```

**Check logs:**

```bash
# View recent logs
sudo journalctl -u cafe-kiosk-backend -n 50

# View live logs
sudo journalctl -u cafe-kiosk-backend -f
```

**Common causes and solutions:**

#### 1. Port 8080 already in use

```bash
# Check what's using port 8080
sudo lsof -i :8080

# Kill the process if needed
sudo kill -9 PID_NUMBER
```

#### 2. JAR file not found

```bash
# Verify JAR exists
ls -la ~/cafe_kiosk_full_stack/backend/target/*.jar

# If missing, rebuild
cd ~/cafe_kiosk_full_stack/backend
mvn clean package -DskipTests
```

#### 3. Environment variables not set

```bash
# Check environment variables
cat /etc/environment

# Or check service file environment
sudo cat /etc/systemd/system/cafe-kiosk-backend.service

# Restart after fixing
sudo systemctl daemon-reload
sudo systemctl restart cafe-kiosk-backend
```

#### 4. Database connection issue

See [Database Connection Issues](#database-connection-issues) section below.

---

## Application Not Loading in Browser

### Problem: Blank page or 404 error

**Check nginx is running:**

```bash
sudo systemctl status nginx
```

**Check frontend files exist:**

```bash
ls -la /var/www/html/
```

Should show `index.html` and `assets/` directory.

**If files are missing:**

```bash
cd ~/cafe_kiosk_full_stack/frontend
npm run build
sudo cp -r dist/* /var/www/html/
```

**Check nginx error logs:**

```bash
sudo tail -f /var/log/nginx/error.log
```

### Problem: CSS/JavaScript not loading

**Check nginx access logs:**

```bash
sudo tail -f /var/log/nginx/access.log
```

**Restart nginx:**

```bash
sudo systemctl restart nginx
```

### Problem: Wrong page loads (routing issues)

**Verify nginx config has React Router fallback:**

```bash
sudo nano /etc/nginx/sites-available/default
```

Should have:

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

**Restart nginx after changes:**

```bash
sudo nginx -t  # Test configuration
sudo systemctl restart nginx
```

---

## API Connection Issues

### Problem: Frontend can't connect to backend API

**Symptoms:**
- Menu items don't load
- Orders fail to submit
- Console shows network errors

**Check backend is running:**

```bash
sudo systemctl status cafe-kiosk-backend
```

**Check backend logs:**

```bash
sudo journalctl -u cafe-kiosk-backend -f
```

**Test backend directly:**

```bash
# From EC2 instance
curl http://localhost:8080/menu-items

# Should return JSON data
```

**Check nginx proxy configuration:**

```bash
sudo nano /etc/nginx/sites-available/default
```

Should have:

```nginx
location /api/ {
    proxy_pass http://localhost:8080/;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}
```

**Restart nginx:**

```bash
sudo nginx -t
sudo systemctl restart nginx
```

### Problem: CORS errors in browser console

**Check backend CORS configuration:**

```bash
nano ~/cafe_kiosk_full_stack/backend/src/main/java/MKSS/backend/config/SecurityConfig.java
```

Should allow your EC2 IP:

```java
.allowedOrigins("http://YOUR_EC2_PUBLIC_IP", "http://localhost:5173")
```

**After changes:**

```bash
cd ~/cafe_kiosk_full_stack/backend
mvn clean package -DskipTests
sudo systemctl restart cafe-kiosk-backend
```

---

## Database Connection Issues

### Problem: Backend can't connect to RDS database

**Check environment variables:**

```bash
# Check service file
sudo cat /etc/systemd/system/cafe-kiosk-backend.service | grep Environment
```

Should show:

```
Environment="DB_URL=jdbc:mysql://YOUR_RDS_ENDPOINT:3306/cafedb?useSSL=true&characterEncoding=UTF-8&serverTimezone=UTC"
Environment="DB_USERNAME=root"
Environment="DB_PASSWORD=YOUR_PASSWORD"
```

**Test database connection from EC2:**

```bash
# Install MySQL client if not already installed
sudo apt install mysql-client -y

# Test connection
mysql -h YOUR_RDS_ENDPOINT -u root -p
```

Enter your password when prompted.

**Check RDS Security Group:**

- Go to AWS Console → RDS → Your Database → Connectivity & Security
- Check Security Group allows inbound traffic on port 3306 from your EC2's security group

**Check backend logs for specific error:**

```bash
sudo journalctl -u cafe-kiosk-backend -n 100 | grep -i "error\|exception"
```

**Common fixes:**

```bash
# After fixing environment variables
sudo systemctl daemon-reload
sudo systemctl restart cafe-kiosk-backend
```

---

## Permission Errors

### Problem: Permission denied when copying files to /var/www/html/

**Solution:**

```bash
# Use sudo for copying
sudo cp -r dist/* /var/www/html/

# Check ownership
ls -la /var/www/html/

# If needed, fix ownership
sudo chown -R www-data:www-data /var/www/html/
```

### Problem: Can't edit nginx configuration

**Solution:**

```bash
# Use sudo
sudo nano /etc/nginx/sites-available/default
```

### Problem: Can't restart services

**Solution:**

```bash
# Use sudo
sudo systemctl restart cafe-kiosk-backend
sudo systemctl restart nginx
```

---

## Complete Reset (Last Resort)

If everything is broken and you want to start fresh:

```bash
# Stop services
sudo systemctl stop cafe-kiosk-backend
sudo systemctl stop nginx

# Remove old builds
rm -rf ~/cafe_kiosk_full_stack/backend/target
rm -rf ~/cafe_kiosk_full_stack/frontend/dist
rm -rf ~/cafe_kiosk_full_stack/frontend/node_modules
sudo rm -rf /var/www/html/*

# Pull latest code
cd ~/cafe_kiosk_full_stack
git fetch --all
git reset --hard origin/main

# Rebuild backend
cd backend
mvn clean package -DskipTests

# Rebuild frontend
cd ../frontend
npm install
npm run build
sudo cp -r dist/* /var/www/html/

# Restart services
sudo systemctl start cafe-kiosk-backend
sudo systemctl start nginx

# Check status
sudo systemctl status cafe-kiosk-backend
sudo systemctl status nginx
```

---

## Getting More Help

### View all logs at once

```bash
# Backend logs (last 50 lines)
echo "=== BACKEND LOGS ===" && sudo journalctl -u cafe-kiosk-backend -n 50

# Nginx error logs
echo "=== NGINX ERROR LOGS ===" && sudo tail -20 /var/log/nginx/error.log

# Nginx access logs
echo "=== NGINX ACCESS LOGS ===" && sudo tail -20 /var/log/nginx/access.log
```

### Check all service statuses

```bash
echo "=== BACKEND SERVICE ===" && sudo systemctl status cafe-kiosk-backend --no-pager
echo ""
echo "=== NGINX SERVICE ===" && sudo systemctl status nginx --no-pager
```

### Verify file locations

```bash
echo "=== FRONTEND FILES ===" && ls -la /var/www/html/
echo ""
echo "=== BACKEND JAR ===" && ls -la ~/cafe_kiosk_full_stack/backend/target/*.jar
```

---

## Still Having Issues?

1. Check the logs carefully using the commands above
2. Search for the specific error message online
3. Verify all configuration files match the deployment guide
4. Ensure security groups allow necessary traffic
5. Test components individually (database, backend, frontend)
