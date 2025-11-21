# Render Deployment Guide - Cafe Kiosk Backend

This guide will walk you through deploying your Spring Boot backend to Render.

## Prerequisites

- GitHub account with your repository pushed
- Render account (sign up at https://render.com - free tier available)
- Your code pushed to GitHub: `https://github.com/murasakijyuutann/cafe_kiosk_full_stack`

## Step 1: Prepare Your Backend for Deployment

### 1.1 Create a build script (already configured in pom.xml)

Your `pom.xml` is already configured with Spring Boot Maven Plugin. Render will use:
```bash
mvn clean install
```

### 1.2 Verify application.yml uses environment variables

Your `backend/src/main/resources/application.yml` should use environment variables (already done):
```yaml
spring:
  datasource:
    url: ${DB_URL}
    username: ${DB_USERNAME}
    password: ${DB_PASSWORD}
```

## Step 2: Set Up MySQL Database on Render

### 2.1 Create a PostgreSQL Database (Recommended)

**Note:** Render doesn't offer managed MySQL on free tier. You have two options:

**Option A: Use PostgreSQL (Recommended for Render)**
1. Go to Render Dashboard: https://dashboard.render.com
2. Click "New +" → "PostgreSQL"
3. Fill in:
   - Name: `cafe-kiosk-db`
   - Database: `cafedb`
   - User: (auto-generated)
   - Region: Choose closest to you
   - Plan: Free
4. Click "Create Database"
5. Save the "Internal Database URL" - you'll need this later

**Option B: Use External MySQL (Aiven, PlanetScale, etc.)**
1. Sign up for a free MySQL service:
   - Aiven: https://aiven.io (free tier)
   - PlanetScale: https://planetscale.com (free tier)
2. Create a MySQL database
3. Get the connection URL

### 2.2 If using PostgreSQL, update pom.xml

Add PostgreSQL driver to `backend/pom.xml`:

```xml
<!-- Replace MySQL with PostgreSQL -->
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <scope>runtime</scope>
</dependency>
```

And update `application.yml` dialect:
```yaml
jpa:
  properties:
    hibernate:
      dialect: org.hibernate.dialect.PostgreSQLDialect
```

## Step 3: Deploy Backend to Render

### 3.1 Create a New Web Service

1. Go to Render Dashboard: https://dashboard.render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Select: `murasakijyuutann/cafe_kiosk_full_stack`

### 3.2 Configure the Web Service

Fill in the following settings:

| Setting | Value |
|---------|-------|
| **Name** | `cafe-kiosk-backend` |
| **Region** | Choose closest to you |
| **Branch** | `main` |
| **Root Directory** | `backend` |
| **Runtime** | `Java` |
| **Build Command** | `./mvnw clean install -DskipTests` |
| **Start Command** | `java -jar target/cafe_kiosk-0.0.1-SNAPSHOT.jar` |
| **Plan** | Free |

### 3.3 Add Environment Variables

Click "Advanced" and add these environment variables:

#### If using PostgreSQL:
| Key | Value |
|-----|-------|
| `SPRING_PROFILE` | `prod` |
| `DB_URL` | (Internal Database URL from Step 2.1) |
| `DB_USERNAME` | (auto-generated from database) |
| `DB_PASSWORD` | (auto-generated from database) |
| `JAVA_TOOL_OPTIONS` | `-Xmx512m` |

#### If using MySQL:
| Key | Value |
|-----|-------|
| `SPRING_PROFILE` | `prod` |
| `DB_URL` | `jdbc:mysql://your-host:3306/cafedb?serverTimezone=UTC` |
| `DB_USERNAME` | Your MySQL username |
| `DB_PASSWORD` | Your MySQL password |
| `JAVA_TOOL_OPTIONS` | `-Xmx512m` |

### 3.4 Create the Service

1. Click "Create Web Service"
2. Render will start building and deploying your app
3. Wait 5-10 minutes for the first deployment

## Step 4: Verify Deployment

### 4.1 Check Deployment Status

1. Go to your service in Render Dashboard
2. Check the "Logs" tab for any errors
3. Wait for "Deploy succeeded" message

### 4.2 Test Your API

Your backend will be available at:
```
https://cafe-kiosk-backend.onrender.com
```

Test endpoints:
- Health check: `https://cafe-kiosk-backend.onrender.com/actuator/health`
- Swagger UI: `https://cafe-kiosk-backend.onrender.com/swagger-ui.html`
- API docs: `https://cafe-kiosk-backend.onrender.com/api-docs`

## Step 5: Update Frontend to Use Deployed Backend

### 5.1 Update Vite Config

In `frontend/vite.config.ts`, update the proxy or API base URL:

```typescript
// For production builds, use the Render URL
const apiUrl = import.meta.env.PROD
  ? 'https://cafe-kiosk-backend.onrender.com'
  : 'http://localhost:8080';
```

### 5.2 Update API Client

In `frontend/src/api/cafekioskApi.ts`:

```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
```

Add to `frontend/.env.production`:
```
VITE_API_URL=https://cafe-kiosk-backend.onrender.com
```

## Step 6: Update Backend CORS Settings

Update `backend/src/main/java/MKSS/backend/config/SecurityConfig.java` to allow your frontend domain:

```java
.cors(cors -> cors.configurationSource(request -> {
    CorsConfiguration config = new CorsConfiguration();
    config.setAllowedOrigins(Arrays.asList(
        "http://localhost:5173",
        "https://your-frontend-domain.pages.dev"  // Add your Cloudflare Pages domain
    ));
    config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    config.setAllowedHeaders(Arrays.asList("*"));
    config.setAllowCredentials(true);
    return config;
}))
```

## Troubleshooting

### Build Fails

**Issue:** Maven build fails
- Check logs in Render dashboard
- Ensure Java 21 is specified in `pom.xml`
- Try running `./mvnw clean install` locally first

### Database Connection Fails

**Issue:** Can't connect to database
- Verify environment variables are set correctly
- Check database URL format
- Ensure database is running and accessible
- Check firewall rules if using external MySQL

### Application Won't Start

**Issue:** App crashes on startup
- Check `JAVA_TOOL_OPTIONS` is set to `-Xmx512m` (Render free tier has limited memory)
- Review application logs in Render dashboard
- Verify `application.yml` configuration

### CORS Errors

**Issue:** Frontend can't connect to backend
- Update CORS configuration in `SecurityConfig.java`
- Add your frontend URL to allowed origins
- Redeploy after changes

## Free Tier Limitations

Render free tier includes:
- ✅ 750 hours/month (enough for one service running 24/7)
- ✅ Auto-sleep after 15 minutes of inactivity
- ⚠️ First request after sleep takes ~30-60 seconds (cold start)
- ⚠️ 512MB RAM limit
- ⚠️ Shared CPU

## Next Steps

1. **Deploy Frontend to Cloudflare Pages**
   - See `CLOUDFLARE_PAGES_DEPLOYMENT.md` (to be created)

2. **Set up Custom Domain** (Optional)
   - Render supports custom domains on paid plans
   - Free tier uses `*.onrender.com` subdomain

3. **Monitor Your Application**
   - Use Render dashboard to view logs
   - Set up alerts for downtime (paid feature)

4. **Database Backups**
   - PostgreSQL on Render: Automatic backups on paid plans
   - Manual backups: Use `pg_dump` for PostgreSQL

## Cost Comparison

| Service | Free Tier | Paid Tier |
|---------|-----------|-----------|
| Render Web Service | 750 hours/month | $7/month (always on) |
| PostgreSQL | 1GB storage | $7/month (10GB) |
| **Total** | **$0/month** | **$14/month** |

Compare to EC2:
- AWS EC2 t2.micro: ~$8-10/month (no database)
- With RDS MySQL: ~$15-20/month

---

**Need Help?**
- Render Docs: https://render.com/docs
- Render Community: https://community.render.com
- Your team: Check the project's GitHub Issues
