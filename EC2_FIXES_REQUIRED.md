# EC2 Production Deployment - CRITICAL FIXES NEEDED

## Issues Found That Cause Order Complete Page to Fail on EC2

### Issue 1: Session Cookie Configuration ❌
**Location:** `application-prod.yml`
**Problem:**
```yaml
session:
  cookie:
    secure: true      # Requires HTTPS (you're using HTTP)
    same-site: strict # Blocks cross-origin cookies
```

**Fix Applied:** Changed to:
```yaml
session:
  cookie:
    secure: false  # Changed - works with HTTP
    same-site: lax # Changed - allows same-site cookies
```

### Issue 2: Frontend API URL Configuration ❌
**Location:** `frontend/.env.production`
**Problem:**
```env
VITE_API_URL=http://13.125.244.172:8080  # Direct call bypasses Nginx
```

**Fix Applied:** Changed to:
```env
VITE_API_URL=/api  # Use Nginx proxy for same-origin
```

### Issue 3: CORS Configuration Too Restrictive ❌
**Location:** `SecurityConfig.java`
**Problem:** Only allows `localhost:5173` and `localhost:3000`

**Fix Applied:** Now uses `allowedOriginPatterns` to support EC2 IPs and AWS domains

### Issue 4: LocalDateTime Serialization ❌
**Location:** `OrderResponse.java`
**Problem:** No `@JsonFormat` annotation on `orderedAt` field

**Fix Applied:** Added:
```java
@JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
private LocalDateTime orderedAt;
```

---

## Deployment Steps After Fixes

### 1. Rebuild and Redeploy Backend
```bash
# SSH into EC2
ssh -i cafe-kiosk-key.pem ubuntu@13.125.244.172

# Navigate to project
cd ~/cafe_kiosk_full_stack

# Pull latest changes
git pull origin main

# Rebuild backend
cd backend
mvn clean package -DskipTests

# Copy to deployment location
sudo cp target/*.jar /opt/cafe-kiosk/backend.jar

# Restart service
sudo systemctl restart cafe-kiosk-backend

# Check status
sudo systemctl status cafe-kiosk-backend
```

### 2. Rebuild and Redeploy Frontend
```bash
# On EC2, in project directory
cd ~/cafe_kiosk_full_stack/frontend

# Install dependencies (if needed)
npm install

# Build with production config
npm run build

# Deploy to nginx
sudo rm -rf /var/www/cafe-kiosk/*
sudo cp -r dist/* /var/www/cafe-kiosk/

# Reload nginx
sudo systemctl reload nginx
```

### 3. Verify Nginx Configuration
```bash
# Edit nginx config if needed
sudo nano /etc/nginx/sites-available/cafe-kiosk

# Make sure it has:
server {
    listen 80;
    server_name 13.125.244.172;  # Your EC2 IP

    # Frontend
    location / {
        root /var/www/cafe-kiosk;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Backend API Proxy
    location /api/ {
        proxy_pass http://localhost:8080/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Important for cookies/sessions
        proxy_cookie_path / /;
    }
}

# Test and reload
sudo nginx -t
sudo systemctl reload nginx
```

### 4. Test the Application
```bash
# Test backend directly
curl http://localhost:8080/menu

# Test through nginx proxy
curl http://13.125.244.172/api/menu

# Check logs
sudo journalctl -u cafe-kiosk-backend -f
sudo tail -f /var/log/nginx/cafe-kiosk-error.log
```

### 5. Test Order Flow
1. Open browser: `http://13.125.244.172`
2. Add items to cart
3. Go to cart
4. Complete order
5. **Should now see order complete page with all details**

---

## Why It Works Now

### Before:
- ❌ Frontend calls `http://13.125.244.172:8080` (different port = CORS issue)
- ❌ Session cookies blocked by `secure: true` and `same-site: strict`
- ❌ LocalDateTime not properly serialized
- ❌ Order complete page gets no data or wrong format

### After:
- ✅ Frontend calls `/api/*` → Nginx proxies to backend (same origin)
- ✅ Session cookies work with `secure: false` and `same-site: lax`
- ✅ LocalDateTime properly formatted as ISO string
- ✅ Order complete page receives complete order data

---

## Troubleshooting

### If Order Complete Still Shows White Screen:

**Check Browser Console (F12):**
```javascript
// Look for errors like:
// - CORS errors
// - 401/403 (session lost)
// - Network errors
// - State is null/undefined
```

**Check Backend Logs:**
```bash
sudo journalctl -u cafe-kiosk-backend -n 100 --no-pager | grep -i error
```

**Check Nginx Logs:**
```bash
sudo tail -f /var/log/nginx/cafe-kiosk-error.log
```

**Verify Session Persists:**
```bash
# Add items to cart, then check
curl -b cookies.txt -c cookies.txt http://13.125.244.172/api/cart
```

### Common Issues:

1. **Order data is null**
   - Session lost between cart and checkout
   - Fix: Verify cookies are being sent/received

2. **CORS errors**
   - Verify nginx proxy is working
   - Check backend allows origin

3. **404 on /order-complete**
   - Verify nginx `try_files $uri $uri/ /index.html;`
   - Rebuild frontend with latest code

4. **Date parsing errors**
   - Verify `@JsonFormat` is applied
   - Check browser console for date format errors
