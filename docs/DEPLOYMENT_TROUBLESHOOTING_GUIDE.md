# Deployment Troubleshooting Guide

Common issues encountered during EC2 deployment and their solutions.

---

## Issue 1: Frontend Changes Not Appearing After Deployment

### Symptoms
- Ran `npm run build` and `sudo cp -r dist/* /var/www/html/`
- Browser still shows old version of the application
- Hard refresh (Ctrl + Shift + R) doesn't help
- Images or code changes don't appear

### Root Cause
**Copying files to wrong directory** - Nginx is configured to serve from a different location than where you copied the files.

### Diagnosis Steps

1. **Check nginx configuration:**
```bash
cat /etc/nginx/sites-enabled/cafe-kiosk | grep "root"
```

Look for the `root` directive:
```nginx
location / {
    root /var/www/cafe-kiosk;  # ← This is where Nginx serves files from
}
```

2. **Check where you copied files:**
```bash
ls -lh /var/www/html/index.html        # Wrong location
ls -lh /var/www/cafe-kiosk/index.html  # Correct location
```

3. **Verify what Nginx is actually serving:**
```bash
curl http://localhost/
```

Check the `<script>` tag - compare the hash in the filename with your built files:
```html
<script type="module" crossorigin src="/assets/index-DecIt0Ls.js"></script>
```

4. **Check your built files:**
```bash
ls -la /var/www/cafe-kiosk/assets/
```

If the JavaScript file mentioned in the HTML doesn't exist, files are in the wrong location.

### Solution

**Always copy to the directory specified in nginx config:**

```bash
# Find the correct directory
cat /etc/nginx/sites-enabled/cafe-kiosk | grep "root"

# Copy to correct location (replace /var/www/cafe-kiosk with your actual path)
cd ~/cafe_kiosk_full_stack/frontend
npm run build
sudo cp -r dist/* /var/www/cafe-kiosk/

# Verify deployment
ls -lh /var/www/cafe-kiosk/index.html
```

### Prevention

Create a deployment script to avoid this mistake:

```bash
#!/bin/bash
# deploy-frontend.sh

NGINX_ROOT=$(grep -oP 'root \K[^;]+' /etc/nginx/sites-enabled/cafe-kiosk | head -1)

echo "Building frontend..."
cd ~/cafe_kiosk_full_stack/frontend
npm run build

echo "Deploying to $NGINX_ROOT..."
sudo cp -r dist/* "$NGINX_ROOT/"

echo "Deployment completed at $(date)"
ls -lh "$NGINX_ROOT/index.html"
```

---

## Issue 2: Backend Not Connecting to Database

### Symptoms
- Backend service starts but API returns 500 errors
- Logs show database connection failures
- `curl http://localhost:8080/api/categories` returns error

### Root Cause
Missing or incorrect environment variables for database connection.

### Diagnosis Steps

1. **Check backend logs:**
```bash
sudo journalctl -u cafe-kiosk-backend -n 100 --no-pager
```

Look for errors mentioning:
- `CommunicationsException`
- `Access denied for user`
- `Unknown database`
- `HikariPool - Exception`

2. **Check if environment file exists:**
```bash
ls -la /opt/cafe-kiosk/.env
```

3. **Verify environment variables are loaded:**
```bash
sudo systemctl status cafe-kiosk-backend
```

### Solution

**Create or update the environment file:**

```bash
sudo nano /opt/cafe-kiosk/.env
```

Add:
```env
SPRING_PROFILES_ACTIVE=prod
DB_URL=jdbc:mysql://your-rds-endpoint:3306/mydb?useSSL=false&serverTimezone=UTC
DB_USERNAME=admin
DB_PASSWORD=your_actual_password
```

**Restart backend service:**
```bash
sudo systemctl restart cafe-kiosk-backend
sudo systemctl status cafe-kiosk-backend

# Verify database connection
sudo journalctl -u cafe-kiosk-backend -n 50 --no-pager | grep -i "Started\|HikariPool"
```

---

## Issue 3: Browser Showing Cached Old Version

### Symptoms
- Deployment successful (files copied to correct location)
- `curl http://localhost/` shows new code
- Browser still shows old version
- F12 Elements tab shows old `alt` text or old URLs

### Root Cause
Browser is aggressively caching JavaScript and CSS files.

### Solution

**Try in order:**

1. **Hard refresh (multiple times):**
   - Press `Ctrl + Shift + R` 3-5 times
   - Or `Cmd + Shift + R` on Mac

2. **Clear browser cache completely:**
   - Press `Ctrl + Shift + Delete`
   - Check "Cached images and files"
   - Clear data

3. **Open in Incognito/Private window:**
   - This bypasses all cache
   - Visit `http://13.125.244.172/`

4. **Try a different browser:**
   - If Chrome doesn't work, try Firefox or Edge
   - Fresh browser = no cache

5. **Close browser completely:**
   - Don't just close the tab
   - Close all browser windows
   - Reopen and visit site

### Verification

Check if new code is actually deployed:

```bash
# On EC2, verify the deployed JavaScript contains your changes
grep -r "your-search-term" /var/www/cafe-kiosk/assets/*.js

# Example: Check for S3 URL
grep -r "cafe-kiosk-images" /var/www/cafe-kiosk/assets/*.js
```

If the grep finds your code on EC2 but browser doesn't show it → It's definitely cache.

---

## Issue 4: Images Not Loading from S3

### Symptoms
- Image URLs updated in code
- Deployment successful
- Browser shows broken image icon
- Console shows 403 or 404 errors

### Diagnosis Steps

1. **Test S3 URL directly:**
   - Copy the image URL
   - Paste in browser address bar
   - Does it load?

2. **Check S3 bucket permissions:**
   - Go to AWS Console → S3
   - Check bucket policy allows public read

3. **Check browser console (F12):**
   - Look for errors:
     - `403 Forbidden` → Bucket permissions issue
     - `404 Not Found` → Image doesn't exist or wrong path
     - CORS errors → S3 CORS not configured

### Solution

**Fix S3 bucket policy:**

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::your-bucket-name/*"
        }
    ]
}
```

**Verify image exists:**
```bash
# Test from EC2
curl -I https://your-bucket.s3.region.amazonaws.com/menu/image.jpg
```

Should return `HTTP/2 200` if successful.

---

## Issue 5: Git Pull Shows "Already up to date" But Code Changed

### Symptoms
- Made changes locally
- `git status` shows "working tree clean"
- `git pull` on EC2 shows "Already up to date"
- But new code doesn't appear on EC2

### Root Cause
Changes weren't committed or pushed to GitHub.

### Solution

**On local machine:**

```bash
# Check current status
git status

# Check last commit
git log -1 --oneline

# Verify specific file in repository
git show HEAD:frontend/src/pages/Home.tsx

# If changes aren't committed
git add .
git commit -m "Description of changes"
git push origin main
```

**Then on EC2:**

```bash
cd ~/cafe_kiosk_full_stack
git pull origin main

# Verify changes are now present
cat frontend/src/pages/Home.tsx
```

---

## Quick Deployment Checklist

Before deploying, verify:

- [ ] Changes committed and pushed to GitHub
- [ ] Git pull completed on EC2
- [ ] Frontend build successful (`npm run build`)
- [ ] Files copied to **correct nginx directory** (check nginx config)
- [ ] Backend environment variables configured
- [ ] Services restarted if needed
- [ ] Browser cache cleared (hard refresh or incognito)

---

## Useful Commands Reference

### Check Deployment Status

```bash
# Frontend deployment time
ls -lh /var/www/cafe-kiosk/index.html

# Backend deployment time
ls -lh /opt/cafe-kiosk/backend.jar

# What nginx is serving
curl http://localhost/

# Backend logs
sudo journalctl -u cafe-kiosk-backend -n 50 --no-pager

# Nginx error logs
sudo tail -50 /var/log/nginx/error.log
```

### Service Management

```bash
# Restart backend
sudo systemctl restart cafe-kiosk-backend

# Restart nginx
sudo systemctl restart nginx

# Check service status
sudo systemctl status cafe-kiosk-backend
sudo systemctl status nginx
```

### Verify Services Are Running

```bash
# Check backend API
curl http://localhost:8080/api/categories

# Check frontend
curl http://localhost/

# Check if port 8080 is listening
sudo netstat -tlnp | grep 8080
```

---

## Common Mistakes Summary

| Mistake | Symptom | Fix |
|---------|---------|-----|
| Copying to wrong directory | Changes don't appear | Check nginx config, copy to correct path |
| Missing .env file | Backend 500 errors | Create `/opt/cafe-kiosk/.env` with DB credentials |
| Forgot to push to Git | EC2 pull shows "up to date" | Commit and push from local machine |
| Browser cache | Old version shows | Hard refresh, incognito, or clear cache |
| S3 bucket not public | Images don't load | Fix S3 bucket policy |
| Wrong nginx root path | 404 errors | Update nginx config or copy files to correct location |

---

## Getting Help

When asking for help, provide:

1. **What you're trying to do**
2. **What you expected to happen**
3. **What actually happened**
4. **Relevant logs:**
   ```bash
   # Backend logs
   sudo journalctl -u cafe-kiosk-backend -n 100 --no-pager
   
   # Nginx logs
   sudo tail -50 /var/log/nginx/error.log
   
   # What nginx is serving
   curl http://localhost/
   ```
5. **Your nginx configuration:**
   ```bash
   cat /etc/nginx/sites-enabled/cafe-kiosk
   ```

---

**Last Updated:** November 25, 2025
