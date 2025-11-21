# EC2 Initial Setup Guide - Creating and Configuring EC2 Instance

This guide walks you through creating a new EC2 instance from scratch and deploying your cafe kiosk application.

---

## Table of Contents

1. [Create EC2 Instance](#step-1-create-ec2-instance)
2. [Configure Security Groups](#step-2-configure-security-groups)
3. [Connect to EC2 Instance](#step-3-connect-to-ec2-instance)
4. [Install Required Software](#step-4-install-required-software)
5. [Set Up MySQL Database (RDS)](#step-5-set-up-mysql-database-rds)
6. [Clone Your Project](#step-6-clone-your-project)
7. [Configure Environment Variables](#step-7-configure-environment-variables)
8. [Build and Deploy Backend](#step-8-build-and-deploy-backend)
9. [Build and Deploy Frontend](#step-9-build-and-deploy-frontend)
10. [Configure Nginx](#step-10-configure-nginx)
11. [Test Your Application](#step-11-test-your-application)

---

## Step 1: Create EC2 Instance

### 1.1 Sign in to AWS Console

1. Go to [AWS Console](https://console.aws.amazon.com/)
2. Sign in with your AWS account
3. Select your region (e.g., `ap-northeast-2` for Seoul)

### 1.2 Launch EC2 Instance

1. Navigate to **EC2 Dashboard**
   - Search for "EC2" in the top search bar
   - Click on "EC2" service

2. Click **"Launch Instance"** button

3. **Name your instance**
   - Name: `cafe-kiosk-server` (or any name you prefer)

4. **Choose an Amazon Machine Image (AMI)**
   - Select: **Ubuntu Server 22.04 LTS (HVM), SSD Volume Type**
   - Architecture: **64-bit (x86)**

5. **Choose Instance Type**
   - Select: **t2.micro** (Free tier eligible)
   - 1 vCPU, 1 GB Memory

6. **Create or Select Key Pair** (Important!)
   - Click "Create new key pair"
   - Key pair name: `cafe-kiosk-key` (or your preferred name)
   - Key pair type: **RSA**
   - Private key file format: **`.pem`** (for Mac/Linux) or **`.ppk`** (for Windows/PuTTY)
   - Click "Create key pair"
   - **Save the downloaded file** - you'll need this to SSH into your instance
   - Store it in a safe location (e.g., `C:\Users\YourName\.ssh\cafe-kiosk-key.pem`)

7. **Network Settings**
   - Click "Edit" next to Network settings
   - Create security group: ✅ (or select existing one)
   - Security group name: `cafe-kiosk-sg`
   - Description: `Security group for cafe kiosk application`

   **Inbound rules** (we'll add more in Step 2):
   - SSH (port 22) - Source: My IP (for now)

8. **Configure Storage**
   - Size: **8 GB** (default, sufficient for our app)
   - Volume Type: **gp3** (General Purpose SSD)

9. **Advanced Details** (Optional)
   - Leave defaults for now

10. **Review and Launch**
    - Review your settings
    - Click **"Launch Instance"**
    - Wait 1-2 minutes for instance to start

### 1.3 Get Instance Information

1. Go to **Instances** in the EC2 Dashboard
2. Find your instance: `cafe-kiosk-server`
3. Note the following information:
   - **Instance ID**: `i-xxxxxxxxxxxxxxxxx`
   - **Public IPv4 address**: `xx.xx.xx.xx` (you'll need this to access your app)
   - **Instance state**: Should be "Running" (green)

---

## Step 2: Configure Security Groups

Security groups control what traffic can reach your EC2 instance.

### 2.1 Edit Inbound Rules

1. In EC2 Dashboard, click on **"Security Groups"** (left sidebar)
2. Find and select `cafe-kiosk-sg`
3. Click **"Edit inbound rules"**

### 2.2 Add Required Rules

Add the following inbound rules:

| Type | Protocol | Port Range | Source | Description |
|------|----------|------------|--------|-------------|
| SSH | TCP | 22 | My IP | SSH access from your IP |
| HTTP | TCP | 80 | 0.0.0.0/0 | Web access (frontend) |
| HTTPS | TCP | 443 | 0.0.0.0/0 | Secure web access (optional) |
| Custom TCP | TCP | 8080 | 0.0.0.0/0 | Backend API (optional, for testing) |

**Steps to add each rule:**
1. Click "Add rule"
2. Select **Type** from dropdown
3. Set **Source** (My IP for SSH, 0.0.0.0/0 for HTTP/HTTPS)
4. Add **Description**
5. Click "Save rules"

### 2.3 Outbound Rules

Default outbound rules (All traffic allowed) are sufficient.

---

## Step 3: Connect to EC2 Instance

### 3.1 Set Permissions on Key File (Mac/Linux/Windows Git Bash)

```bash
# Navigate to where you saved the key file
cd ~/.ssh

# Set correct permissions (required for SSH)
chmod 400 cafe-kiosk-key.pem
```

### 3.2 Connect via SSH

```bash
# Replace YOUR_EC2_PUBLIC_IP with your actual EC2 public IP
ssh -i ~/.ssh/cafe-kiosk-key.pem ubuntu@YOUR_EC2_PUBLIC_IP
```

**First time connecting:**
- You'll see a message about authenticity of host
- Type `yes` and press Enter

**Successful connection:**
```
Welcome to Ubuntu 22.04.x LTS
...
ubuntu@ip-xxx-xx-xx-xx:~$
```

### 3.3 Windows Users (Using PuTTY)

If you downloaded `.ppk` file:

1. Download and install [PuTTY](https://www.putty.org/)
2. Open PuTTY
3. In "Host Name": `ubuntu@YOUR_EC2_PUBLIC_IP`
4. In left panel: Connection → SSH → Auth → Credentials
5. Browse and select your `.ppk` file
6. Click "Open"

---

## Step 4: Install Required Software

Now that you're connected to your EC2 instance, install all required software.

### 4.1 Update System Packages

```bash
sudo apt update && sudo apt upgrade -y
```

### 4.2 Install Java 21 (for Spring Boot backend)

```bash
# Install OpenJDK 21
sudo apt install openjdk-21-jdk -y

# Verify installation
java -version
# Should show: openjdk version "21.x.x"
```

### 4.3 Install Maven (for building backend)

```bash
# Install Maven
sudo apt install maven -y

# Verify installation
mvn -version
# Should show Maven version 3.x.x
```

### 4.4 Install Node.js and npm (for building frontend)

```bash
# Install Node.js 20.x (LTS)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node -v
# Should show: v20.x.x

npm -v
# Should show: 10.x.x
```

### 4.5 Install Nginx (web server and reverse proxy)

```bash
# Install Nginx
sudo apt install nginx -y

# Start Nginx
sudo systemctl start nginx

# Enable Nginx to start on boot
sudo systemctl enable nginx

# Check status
sudo systemctl status nginx
# Should show: active (running)
```

### 4.6 Install Git

```bash
# Install Git
sudo apt install git -y

# Verify installation
git --version
```

---

## Step 5: Set Up MySQL Database (RDS)

### Option A: Create RDS MySQL Database (Recommended)

1. **Go to RDS Console**
   - Search for "RDS" in AWS Console
   - Click "Create database"

2. **Choose Database Creation Method**
   - Select: **Standard create**

3. **Engine Options**
   - Engine type: **MySQL**
   - Version: **MySQL 8.0.x** (latest)

4. **Templates**
   - Select: **Free tier**

5. **Settings**
   - DB instance identifier: `cafe-kiosk-db`
   - Master username: `root` (or your preference)
   - Master password: Create a strong password (save this!)

6. **Instance Configuration**
   - DB instance class: **db.t3.micro** (Free tier)

7. **Storage**
   - Storage type: General Purpose SSD (gp2)
   - Allocated storage: **20 GB**

8. **Connectivity**
   - Virtual Private Cloud (VPC): Default VPC
   - Public access: **Yes** (to allow EC2 to connect)
   - VPC security group: Create new
   - Security group name: `cafe-kiosk-db-sg`

9. **Database Authentication**
   - Password authentication

10. **Additional Configuration**
    - Initial database name: `cafedb`
    - Backup retention: 7 days (or 0 for no backups on free tier)

11. **Create Database**
    - Click "Create database"
    - Wait 5-10 minutes for database to be available

12. **Configure Security Group**
    - Go to RDS → Databases → `cafe-kiosk-db`
    - Click on the VPC security group
    - Edit inbound rules
    - Add rule: Type: MySQL/Aurora, Source: Your EC2 security group (`cafe-kiosk-sg`)
    - Save rules

13. **Get Database Endpoint**
    - Go to RDS → Databases → `cafe-kiosk-db`
    - Find **Endpoint** (e.g., `cafe-kiosk-db.xxxxxx.ap-northeast-2.rds.amazonaws.com`)
    - Save this endpoint - you'll need it for environment variables

### Option B: Install MySQL on EC2 (Not Recommended)

Only use this if you don't want to use RDS:

```bash
sudo apt install mysql-server -y
sudo mysql_secure_installation
```

---

## Step 6: Clone Your Project

### 6.1 Set Up GitHub Access

If your repository is private, set up SSH key or use personal access token.

**For public repositories:**

```bash
cd ~
git clone https://github.com/YOUR_USERNAME/cafe_kiosk_full_stack.git
cd cafe_kiosk_full_stack
```

Replace `YOUR_USERNAME` with your GitHub username.

---

## Step 7: Configure Environment Variables

### 7.1 Create Environment Variables File

```bash
sudo nano /etc/environment
```

### 7.2 Add Database Configuration

Add these lines (replace with your actual values):

```bash
DB_URL="jdbc:mysql://YOUR_RDS_ENDPOINT:3306/cafedb?useSSL=true&characterEncoding=UTF-8&serverTimezone=UTC"
DB_USERNAME="root"
DB_PASSWORD="YOUR_DATABASE_PASSWORD"
SPRING_PROFILE="prod"
```

Replace:
- `YOUR_RDS_ENDPOINT` with your actual RDS endpoint (from Step 5)
- `YOUR_DATABASE_PASSWORD` with your actual database password

### 7.3 Save and Exit

- Press `Ctrl + O` to save
- Press `Enter` to confirm
- Press `Ctrl + X` to exit

### 7.4 Load Environment Variables

```bash
source /etc/environment
```

---

## Step 8: Build and Deploy Backend

### 8.1 Navigate to Backend Directory

```bash
cd ~/cafe_kiosk_full_stack/backend
```

### 8.2 Build the Backend

```bash
mvn clean package -DskipTests
```

This will create a JAR file in `target/cafe_kiosk-0.0.1-SNAPSHOT.jar`

### 8.3 Create Systemd Service

Create a service file to run backend automatically:

```bash
sudo nano /etc/systemd/system/cafe-kiosk-backend.service
```

Add the following content:

```ini
[Unit]
Description=Cafe Kiosk Backend
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/home/ubuntu/cafe_kiosk_full_stack/backend
Environment="DB_URL=jdbc:mysql://YOUR_RDS_ENDPOINT:3306/cafedb?useSSL=true&characterEncoding=UTF-8&serverTimezone=UTC"
Environment="DB_USERNAME=root"
Environment="DB_PASSWORD=YOUR_DATABASE_PASSWORD"
Environment="SPRING_PROFILE=prod"
ExecStart=/usr/bin/java -jar /home/ubuntu/cafe_kiosk_full_stack/backend/target/cafe_kiosk-0.0.1-SNAPSHOT.jar
Restart=always

[Install]
WantedBy=multi-user.target
```

**Important:** Replace `YOUR_RDS_ENDPOINT` and `YOUR_DATABASE_PASSWORD` with your actual values.

Save and exit (`Ctrl + O`, `Enter`, `Ctrl + X`)

### 8.4 Start the Backend Service

```bash
# Reload systemd to recognize new service
sudo systemctl daemon-reload

# Start the service
sudo systemctl start cafe-kiosk-backend

# Enable service to start on boot
sudo systemctl enable cafe-kiosk-backend

# Check status
sudo systemctl status cafe-kiosk-backend
```

Should show `active (running)` in green.

---

## Step 9: Build and Deploy Frontend

### 9.1 Navigate to Frontend Directory

```bash
cd ~/cafe_kiosk_full_stack/frontend
```

### 9.2 Install Dependencies

```bash
npm install
```

This may take 2-3 minutes.

### 9.3 Build the Frontend

```bash
npm run build
```

This creates a `dist/` folder with production-ready files.

### 9.4 Deploy to Nginx Directory

```bash
# Remove default nginx files
sudo rm -rf /var/www/html/*

# Copy built files to nginx directory
sudo cp -r dist/* /var/www/html/

# Verify files were copied
ls -la /var/www/html/
```

You should see `index.html`, `assets/`, and other build files.

---

## Step 10: Configure Nginx

### 10.1 Edit Nginx Configuration

```bash
sudo nano /etc/nginx/sites-available/default
```

### 10.2 Replace with This Configuration

Delete existing content and paste:

```nginx
server {
    listen 80 default_server;
    listen [::]:80 default_server;

    root /var/www/html;
    index index.html;

    server_name _;

    # Frontend - serve React app
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Backend API proxy
    location /api/ {
        proxy_pass http://localhost:8080/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Save and exit (`Ctrl + O`, `Enter`, `Ctrl + X`)

### 10.3 Test Nginx Configuration

```bash
sudo nginx -t
```

Should show: `syntax is ok` and `test is successful`

### 10.4 Restart Nginx

```bash
sudo systemctl restart nginx

# Check status
sudo systemctl status nginx
```

Should show `active (running)`.

---

## Step 11: Test Your Application

### 11.1 Get Your EC2 Public IP

```bash
# From EC2 instance
curl http://checkip.amazonaws.com
```

Or find it in AWS Console → EC2 → Instances → Your instance

### 11.2 Open in Browser

Visit in your web browser:
```
http://YOUR_EC2_PUBLIC_IP
```

### 11.3 Test Functionality

1. **Homepage** - Should load the cafe image
2. **Menu Page** - Click "Menu" - items should load from backend
3. **Add to Cart** - Click on menu items to add to cart
4. **View Cart** - Click "Cart" - should show added items
5. **Place Order** - Try completing an order

### 11.4 Check Logs if Issues

```bash
# Backend logs
sudo journalctl -u cafe-kiosk-backend -f

# Nginx error logs
sudo tail -f /var/log/nginx/error.log

# Nginx access logs
sudo tail -f /var/log/nginx/access.log
```

---

## Summary

You've successfully:

✅ Created an EC2 instance
✅ Configured security groups
✅ Installed Java, Maven, Node.js, and Nginx
✅ Set up RDS MySQL database
✅ Deployed Spring Boot backend
✅ Deployed React frontend
✅ Configured Nginx as reverse proxy
✅ Tested the application

---

## Next Steps

- **Update Application**: See [EC2_UPDATE_DEPLOYMENT.md](./EC2_UPDATE_DEPLOYMENT.md)
- **Troubleshooting**: See [EC2_DEPLOYMENT_TROUBLESHOOTING.md](./EC2_DEPLOYMENT_TROUBLESHOOTING.md)
- **Optional**: Set up HTTPS with Let's Encrypt SSL certificate
- **Optional**: Configure a custom domain name
- **Optional**: Set up automatic backups for RDS database

---

## Cost Estimates (AWS Free Tier)

| Service | Free Tier | After Free Tier |
|---------|-----------|-----------------|
| EC2 t2.micro | 750 hours/month (1 year) | ~$8-10/month |
| RDS db.t3.micro | 750 hours/month (1 year) | ~$15/month |
| Storage (20GB) | 20 GB (1 year) | ~$2/month |
| Data Transfer | 15 GB/month | $0.09/GB |
| **Total** | **$0/month (first year)** | **~$25-30/month** |

**Tips to minimize costs:**
- Stop EC2 instance when not in use
- Use AWS Cost Explorer to monitor usage
- Set up billing alerts in AWS Console
