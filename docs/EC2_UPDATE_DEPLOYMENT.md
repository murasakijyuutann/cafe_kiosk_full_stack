# EC2 Deployment Update Guide

This guide shows you how to update your deployed EC2 application when you make changes to your local code.

---

## Prerequisites

- Local changes committed and ready to push
- SSH access to your EC2 instance
- Git repository set up (GitHub, GitLab, etc.)

---

## Step 0: Start Your EC2 Instance (if stopped)

If your EC2 instance is stopped, you need to start it first:

### Option 1: Using AWS Console (Web Browser)

1. **Go to AWS Console**
   - Visit [https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)
   - Sign in to your AWS account

2. **Navigate to Instances**
   - Click on "Instances" in the left sidebar
   - Find your cafe kiosk EC2 instance in the list

3. **Start the Instance**
   - Select your instance (checkbox on the left)
   - Click "Instance state" dropdown at the top
   - Click "Start instance"
   - Wait for Instance State to change from "Stopped" to "Running" (takes 1-2 minutes)

4. **Get the Public IP Address**
   - Once running, click on your instance ID
   - Find "Public IPv4 address" or "Public IPv4 DNS" in the details
   - Copy this IP address - you'll need it to SSH into the instance

### Option 2: Using AWS CLI (Command Line)

If you have AWS CLI installed and configured:

```bash
# List your instances to find the instance ID
aws ec2 describe-instances --query 'Reservations[*].Instances[*].[InstanceId,Tags[?Key==`Name`].Value|[0],State.Name]' --output table

# Start your instance (replace i-xxxxx with your actual instance ID)
aws ec2 start-instances --instance-ids i-xxxxx

# Wait for it to be running
aws ec2 wait instance-running --instance-ids i-xxxxx

# Get the public IP address
aws ec2 describe-instances --instance-ids i-xxxxx --query 'Reservations[0].Instances[0].PublicIpAddress' --output text
```

### Important Notes

- **Public IP may change**: If you stopped and started your instance, the public IP address may have changed. Always check the current IP before connecting.
- **Elastic IP (Optional)**: To keep the same IP address even after stopping/starting, you can allocate an Elastic IP and associate it with your instance (note: Elastic IPs may incur charges when not associated with a running instance).
- **Services auto-start**: When your EC2 instance starts, the backend service and nginx should start automatically (they're enabled in systemd).

---

## Step 1: Commit and Push Local Changes

On your **local machine** (Windows):

```bash
cd c:\Users\rwoo1\Documents\VSCodeProjects\cafe_kiosk_full_stack

# Check what files have changed
git status

# Add all modified files
git add .

# Commit with a descriptive message
git commit -m "Update frontend components: CartPage, Footer, Navbar, MenuList"

# Push to GitHub
git push origin main
```

---

## Step 2: SSH into EC2 Instance

Connect to your EC2 server:

```bash
ssh -i your-key.pem ubuntu@YOUR_EC2_PUBLIC_IP
```

Replace:
- `your-key.pem` with your actual key file path
- `YOUR_EC2_PUBLIC_IP` with your EC2 instance's public IP address

---

## Step 3: Navigate to Project Directory

Once connected to EC2:

```bash
cd ~/cafe_kiosk_full_stack
```

---

## Step 4: Pull Latest Changes from Git

Pull the changes you just pushed:

```bash
git pull origin main
```

You should see output showing which files were updated.

---

## Step 5: Update Frontend (if frontend files changed)

If you modified any frontend files (React components, styles, etc.):

```bash
# Navigate to frontend directory
cd ~/cafe_kiosk_full_stack/frontend

# Rebuild the frontend
npm run build

# Remove old build files
sudo rm -rf /var/www/html/*

# Copy new build to nginx directory
sudo cp -r dist/* /var/www/html/

# Verify files were copied
ls -la /var/www/html/
```

You should see `index.html`, `assets/`, and other build files.

---

## Step 6: Update Backend (if backend files changed)

If you modified any backend files (Java classes, application.yml, etc.):

```bash
# Navigate to backend directory
cd ~/cafe_kiosk_full_stack/backend

# Rebuild the backend
mvn clean package -DskipTests

# Restart the backend service
sudo systemctl restart cafe-kiosk-backend

# Check service status
sudo systemctl status cafe-kiosk-backend
```

Service should show `active (running)` in green.

---

## Step 7: Verify Services are Running

Check that all services are active:

```bash
# Check backend service
sudo systemctl status cafe-kiosk-backend

# Check nginx service
sudo systemctl status nginx
```

Both should show `active (running)`.

---

## Step 8: Test Your Application

Open your browser and visit:

```
http://YOUR_EC2_PUBLIC_IP
```

Test the following:
1. Homepage loads correctly
2. Navigate to Menu page
3. Add items to cart
4. View cart page
5. Complete an order

---

## Quick Reference Commands

### For Frontend-Only Updates:
```bash
cd ~/cafe_kiosk_full_stack/frontend
git pull origin main
npm run build
sudo cp -r dist/* /var/www/html/
```

### For Backend-Only Updates:
```bash
cd ~/cafe_kiosk_full_stack/backend
git pull origin main
mvn clean package -DskipTests
sudo systemctl restart cafe-kiosk-backend
```

### For Both Frontend and Backend:
```bash
cd ~/cafe_kiosk_full_stack
git pull origin main

# Update frontend
cd frontend
npm run build
sudo cp -r dist/* /var/www/html/

# Update backend
cd ../backend
mvn clean package -DskipTests
sudo systemctl restart cafe-kiosk-backend
```

---

## Verification Commands

```bash
# Check backend logs (live)
sudo journalctl -u cafe-kiosk-backend -f

# Check nginx error logs
sudo tail -f /var/log/nginx/error.log

# Check nginx access logs
sudo tail -f /var/log/nginx/access.log

# Check backend service status
sudo systemctl status cafe-kiosk-backend

# Check nginx service status
sudo systemctl status nginx
```

---

## Common File Locations

| Component | Location |
|-----------|----------|
| Project Directory | `/home/ubuntu/cafe_kiosk_full_stack/` |
| Frontend Build Output | `/var/www/html/` |
| Backend JAR | `/home/ubuntu/cafe_kiosk_full_stack/backend/target/cafe_kiosk-0.0.1-SNAPSHOT.jar` |
| Backend Service File | `/etc/systemd/system/cafe-kiosk-backend.service` |
| Nginx Config | `/etc/nginx/sites-available/default` |
| Environment Variables | `/etc/environment` |

---

## Next Steps

After successfully updating your deployment, continue to [EC2_DEPLOYMENT_TROUBLESHOOTING.md](./EC2_DEPLOYMENT_TROUBLESHOOTING.md) if you encounter any issues.
