# EC2 Deployment Checklist

## ✅ Pre-Deployment Checklist

### 1. Security Review
- [ ] Remove hardcoded credentials from code
- [ ] Verify `.env` files are in `.gitignore`
- [ ] Never commit `.pem` key files
- [ ] Change default RDS password

### 2. Configuration Files
- [ ] `application-prod.yml` created ✓
- [ ] `.env.example` created for backend ✓
- [ ] `.env.production` created for frontend ✓
- [ ] `nginx-cafe-kiosk.conf` created ✓
- [ ] `cafe-kiosk-backend.service` created ✓
- [ ] `deploy.sh` script created ✓

### 3. Before Pushing to Git
```bash
# Make sure these are NOT committed:
git status | grep -E "(\.env$|\.pem$|\.ppk$)"

# If they appear, remove them:
git rm --cached backend/.env
git rm --cached cafe-kiosk-key.pem
```

---

## 🚀 Deployment Steps

### Step 1: Prepare EC2 Instance

```bash
# SSH into your EC2 instance
ssh -i cafe-kiosk-key.pem ubuntu@YOUR_EC2_IP

# Update system
sudo apt update && sudo apt upgrade -y

# Install Java 21
sudo apt install -y openjdk-21-jdk

# Install Maven
sudo apt install -y maven

# Install Node.js & npm
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install Nginx
sudo apt install -y nginx

# Verify installations
java -version
mvn -version
node -v
npm -v
nginx -v
```

### Step 2: Create Application Directories

```bash
# Create application directory
sudo mkdir -p /opt/cafe-kiosk
sudo chown ubuntu:ubuntu /opt/cafe-kiosk

# Create frontend directory
sudo mkdir -p /var/www/cafe-kiosk
sudo chown -R ubuntu:ubuntu /var/www/cafe-kiosk

# Create log directory
sudo mkdir -p /var/log/cafe-kiosk
sudo chown ubuntu:ubuntu /var/log/cafe-kiosk
```

### Step 3: Clone Your Repository

```bash
cd ~
git clone https://github.com/YOUR_USERNAME/cafe_kiosk_full_stack.git
cd cafe_kiosk_full_stack
```

### Step 4: Configure Environment Variables

```bash
# Create backend .env file
cd ~/cafe_kiosk_full_stack
sudo nano /opt/cafe-kiosk/.env
```

Add this content (replace with your actual values):
```env
DB_URL=jdbc:mysql://mydb.czwaweqgeexp.ap-northeast-2.rds.amazonaws.com:3306/cafedb?useSSL=true&characterEncoding=UTF-8&serverTimezone=UTC
DB_USERNAME=root
DB_PASSWORD=YOUR_ACTUAL_PASSWORD
SPRING_PROFILES_ACTIVE=prod
SERVER_PORT=8080
CORS_ALLOWED_ORIGINS=http://YOUR_EC2_IP,http://YOUR_DOMAIN
```

Save and exit (Ctrl+X, Y, Enter)

```bash
# Set proper permissions
sudo chmod 600 /opt/cafe-kiosk/.env
sudo chown ubuntu:ubuntu /opt/cafe-kiosk/.env
```

### Step 5: Update Frontend Environment

```bash
# Edit frontend .env.production
nano ~/cafe_kiosk_full_stack/frontend/.env.production
```

Update with your EC2 IP:
```env
VITE_API_URL=http://YOUR_EC2_PUBLIC_IP
```

### Step 6: Build Backend

```bash
cd ~/cafe_kiosk_full_stack/backend
mvn clean package -DskipTests

# Copy JAR to deployment directory
sudo cp target/*.jar /opt/cafe-kiosk/backend.jar
```

### Step 7: Setup Backend Service

```bash
# Copy service file
sudo cp ~/cafe_kiosk_full_stack/cafe-kiosk-backend.service /etc/systemd/system/

# Reload systemd
sudo systemctl daemon-reload

# Enable service to start on boot
sudo systemctl enable cafe-kiosk-backend

# Start the service
sudo systemctl start cafe-kiosk-backend

# Check status
sudo systemctl status cafe-kiosk-backend

# View logs
sudo journalctl -u cafe-kiosk-backend -f
```

### Step 8: Build & Deploy Frontend

```bash
cd ~/cafe_kiosk_full_stack/frontend

# Install dependencies
npm install

# Build for production
npm run build

# Copy build files to nginx directory
sudo cp -r dist/* /var/www/cafe-kiosk/
```

### Step 9: Configure Nginx

```bash
# Copy nginx config
sudo cp ~/cafe_kiosk_full_stack/nginx-cafe-kiosk.conf /etc/nginx/sites-available/cafe-kiosk

# Update the config with your EC2 IP
sudo nano /etc/nginx/sites-available/cafe-kiosk
# Change: server_name YOUR_EC2_PUBLIC_IP;

# Create symbolic link
sudo ln -s /etc/nginx/sites-available/cafe-kiosk /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test nginx configuration
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx

# Enable nginx on boot
sudo systemctl enable nginx
```

### Step 10: Configure Security Group

In AWS Console:
1. Go to EC2 → Security Groups
2. Select your instance's security group
3. Add inbound rules:
   - HTTP (80) - Source: 0.0.0.0/0
   - Custom TCP (8080) - Source: Your IP (for testing)
   - HTTPS (443) - Source: 0.0.0.0/0 (if using SSL later)

### Step 11: Test Your Application

```bash
# Test backend directly
curl http://localhost:8080/menu

# Test through nginx
curl http://YOUR_EC2_IP/api/menu

# Open in browser
http://YOUR_EC2_IP
```

---

## 🔄 Redeployment (After Code Changes)

```bash
# SSH into EC2
ssh -i cafe-kiosk-key.pem ubuntu@YOUR_EC2_IP

# Navigate to project
cd ~/cafe_kiosk_full_stack

# Pull latest changes
git pull origin main

# Run deployment script
chmod +x deploy.sh
./deploy.sh
```

---

## 🐛 Troubleshooting

### Backend Won't Start

```bash
# Check logs
sudo journalctl -u cafe-kiosk-backend -n 100 --no-pager

# Check if port 8080 is in use
sudo lsof -i :8080

# Restart service
sudo systemctl restart cafe-kiosk-backend
```

### Frontend Shows 404

```bash
# Check nginx error logs
sudo tail -f /var/log/nginx/cafe-kiosk-error.log

# Verify files exist
ls -la /var/www/cafe-kiosk/

# Reload nginx
sudo systemctl reload nginx
```

### API Calls Fail (CORS)

```bash
# Check backend logs for CORS errors
sudo journalctl -u cafe-kiosk-backend -f

# Verify CORS_ALLOWED_ORIGINS in /opt/cafe-kiosk/.env
sudo nano /opt/cafe-kiosk/.env

# Restart backend after changes
sudo systemctl restart cafe-kiosk-backend
```

### Database Connection Failed

```bash
# Test database connection
mysql -h mydb.czwaweqgeexp.ap-northeast-2.rds.amazonaws.com -u root -p

# Check RDS security group allows EC2 IP
# AWS Console → RDS → Security Groups
```

---

## 📊 Monitoring

```bash
# Watch backend logs
sudo journalctl -u cafe-kiosk-backend -f

# Watch nginx access logs
sudo tail -f /var/log/nginx/cafe-kiosk-access.log

# Watch nginx error logs
sudo tail -f /var/log/nginx/cafe-kiosk-error.log

# Check system resources
htop
```

---

## 🔒 Security Best Practices

1. **Never commit sensitive files:**
   - `.env` files
   - `.pem` key files
   - Database passwords

2. **Regularly update:**
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

3. **Use HTTPS (optional but recommended):**
   - Get free SSL with Let's Encrypt
   - Update nginx config for HTTPS

4. **Limit SSH access:**
   - Security Group: Only allow SSH from your IP
   - Use key-based authentication only

5. **Monitor logs regularly:**
   - Check for unauthorized access attempts
   - Monitor application errors

---

## 📝 Important Files Created

1. **Backend:**
   - `backend/src/main/resources/application-prod.yml` - Production config
   - `backend/.env.example` - Template for environment variables
   - `cafe-kiosk-backend.service` - Systemd service file

2. **Frontend:**
   - `frontend/.env.production` - Production API URL
   - `frontend/.env.development` - Development API URL

3. **Nginx:**
   - `nginx-cafe-kiosk.conf` - Nginx configuration

4. **Scripts:**
   - `deploy.sh` - Automated deployment script

5. **Updated:**
   - `.gitignore` - Now excludes `.env` and `.pem` files
   - `SecurityConfig.java` - Now uses environment variable for CORS
   - `cafekioskApi.ts` - Now uses environment variable for API URL
