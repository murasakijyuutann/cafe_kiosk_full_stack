# S3 and RDS Image Setup Guide for Cafe Kiosk

This guide will help you set up S3 for hosting menu images and update your RDS database with the image URLs.

---

## Part 1: Create S3 Bucket and Upload Images

### Step 1: Create S3 Bucket

1. **Go to AWS Console** → Search for **S3**
2. Click **Create bucket**
3. Configure:
   - **Bucket name**: `cafe-kiosk-images` (must be globally unique)
   - **Region**: `ap-northeast-2` (Seoul - same as your RDS)
   - **Block Public Access**: Uncheck "Block all public access"
   - Check the acknowledgment box
4. Click **Create bucket**

### Step 2: Configure Bucket for Public Read Access

1. Go to your bucket → **Permissions** tab
2. Scroll to **Bucket policy** → Click **Edit**
3. Add this policy (replace `cafe-kiosk-images` with your bucket name):

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::cafe-kiosk-images/*"
        }
    ]
}
```

4. Click **Save changes**

### Step 3: Create Folder Structure and Upload Images

1. In your bucket, click **Create folder**
2. Folder name: `menu`
3. Click **Create folder**

4. Go into the `menu` folder → Click **Upload**
5. Upload your menu item images with these names:
   - `americano.jpg`
   - `latte.jpg`
   - `cappuccino.jpg`
   - `vanilla-latte.jpg`
   - `chocolate-cake.jpg`
   - `cheesecake.jpg`
   - `croissant.jpg`
   - `macaron.jpg`
   - `orange-juice.jpg`
   - `strawberry-smoothie.jpg`
   - `green-tea-latte.jpg`

6. After upload, click on each image → Copy the **Object URL**

Example URL format:
```
https://cafe-kiosk-images.s3.ap-northeast-2.amazonaws.com/menu/americano.jpg
```

---

## Part 2: Connect MySQL Workbench to RDS

### Step 1: Open MySQL Workbench

1. Launch **MySQL Workbench**
2. Click **+** button next to "MySQL Connections"

### Step 2: Configure Connection

Fill in these details:

- **Connection Name**: `Cafe Kiosk RDS`
- **Connection Method**: `Standard (TCP/IP)`
- **Hostname**: `mydb.czwaweqgeexp.ap-northeast-2.rds.amazonaws.com`
- **Port**: `3306`
- **Username**: `admin`
- **Password**: Click **Store in Vault...** → Enter your RDS password

### Step 3: Test Connection

1. Click **Test Connection**
2. If successful, click **OK** to save
3. Double-click the connection to open it

### Step 4: Select Database

```sql
USE mydb;
```

---

## Part 3: Update Database with S3 Image URLs

### Option A: Update Existing Data (If you already have menu items)

Run these UPDATE statements (replace URLs with your actual S3 URLs):

```sql
-- Update Coffee items
UPDATE menu_items 
SET image_url = 'https://cafe-kiosk-images.s3.ap-northeast-2.amazonaws.com/menu/americano.jpg'
WHERE name = '아메리카노';

UPDATE menu_items 
SET image_url = 'https://cafe-kiosk-images.s3.ap-northeast-2.amazonaws.com/menu/latte.jpg'
WHERE name = '카페라떼';

UPDATE menu_items 
SET image_url = 'https://cafe-kiosk-images.s3.ap-northeast-2.amazonaws.com/menu/cappuccino.jpg'
WHERE name = '카푸치노';

UPDATE menu_items 
SET image_url = 'https://cafe-kiosk-images.s3.ap-northeast-2.amazonaws.com/menu/vanilla-latte.jpg'
WHERE name = '바닐라 라떼';

-- Update Dessert items
UPDATE menu_items 
SET image_url = 'https://cafe-kiosk-images.s3.ap-northeast-2.amazonaws.com/menu/chocolate-cake.jpg'
WHERE name = '초콜릿 케이크';

UPDATE menu_items 
SET image_url = 'https://cafe-kiosk-images.s3.ap-northeast-2.amazonaws.com/menu/cheesecake.jpg'
WHERE name = '치즈케이크';

UPDATE menu_items 
SET image_url = 'https://cafe-kiosk-images.s3.ap-northeast-2.amazonaws.com/menu/croissant.jpg'
WHERE name = '크루아상';

UPDATE menu_items 
SET image_url = 'https://cafe-kiosk-images.s3.ap-northeast-2.amazonaws.com/menu/macaron.jpg'
WHERE name = '마카롱';

-- Update Drink items
UPDATE menu_items 
SET image_url = 'https://cafe-kiosk-images.s3.ap-northeast-2.amazonaws.com/menu/orange-juice.jpg'
WHERE name = '오렌지 주스';

UPDATE menu_items 
SET image_url = 'https://cafe-kiosk-images.s3.ap-northeast-2.amazonaws.com/menu/strawberry-smoothie.jpg'
WHERE name = '딸기 스무디';

UPDATE menu_items 
SET image_url = 'https://cafe-kiosk-images.s3.ap-northeast-2.amazonaws.com/menu/green-tea-latte.jpg'
WHERE name = '녹차 라떼';
```

### Option B: Insert Fresh Data with S3 URLs

If you want to start fresh:

```sql
-- Clear existing data
DELETE FROM menu_items;
DELETE FROM categories;

-- Reset auto-increment
ALTER TABLE menu_items AUTO_INCREMENT = 1;
ALTER TABLE categories AUTO_INCREMENT = 1;

-- Insert categories
INSERT INTO categories (name, description, display_order, created_at) VALUES
('커피', '신선한 원두로 만든 커피', 1, NOW()),
('디저트', '달콤한 디저트', 2, NOW()),
('음료', '시원한 음료', 3, NOW());

-- Insert menu items with S3 image URLs
-- Coffee items (category_id = 1)
INSERT INTO menu_items (name, description, price, image_url, available, category_id, created_at, updated_at) VALUES
('아메리카노', '깔끔한 에스프레소와 물', 3000.00, 'https://cafe-kiosk-images.s3.ap-northeast-2.amazonaws.com/menu/americano.jpg', TRUE, 1, NOW(), NOW()),
('카페라떼', '부드러운 우유와 에스프레소', 3500.00, 'https://cafe-kiosk-images.s3.ap-northeast-2.amazonaws.com/menu/latte.jpg', TRUE, 1, NOW(), NOW()),
('카푸치노', '풍성한 거품과 에스프레소', 3500.00, 'https://cafe-kiosk-images.s3.ap-northeast-2.amazonaws.com/menu/cappuccino.jpg', TRUE, 1, NOW(), NOW()),
('바닐라 라떼', '달콤한 바닐라 시럽과 우유', 4000.00, 'https://cafe-kiosk-images.s3.ap-northeast-2.amazonaws.com/menu/vanilla-latte.jpg', TRUE, 1, NOW(), NOW()),

-- Dessert items (category_id = 2)
('초콜릿 케이크', '진한 초콜릿 케이크', 5000.00, 'https://cafe-kiosk-images.s3.ap-northeast-2.amazonaws.com/menu/chocolate-cake.jpg', TRUE, 2, NOW(), NOW()),
('치즈케이크', '부드러운 뉴욕 스타일', 5500.00, 'https://cafe-kiosk-images.s3.ap-northeast-2.amazonaws.com/menu/cheesecake.jpg', TRUE, 2, NOW(), NOW()),
('크루아상', '바삭한 버터 크루아상', 3000.00, 'https://cafe-kiosk-images.s3.ap-northeast-2.amazonaws.com/menu/croissant.jpg', TRUE, 2, NOW(), NOW()),
('마카롱', '달콤한 프랑스 마카롱', 2000.00, 'https://cafe-kiosk-images.s3.ap-northeast-2.amazonaws.com/menu/macaron.jpg', TRUE, 2, NOW(), NOW()),

-- Drink items (category_id = 3)
('오렌지 주스', '신선한 오렌지 주스', 4000.00, 'https://cafe-kiosk-images.s3.ap-northeast-2.amazonaws.com/menu/orange-juice.jpg', TRUE, 3, NOW(), NOW()),
('딸기 스무디', '달콤한 딸기 스무디', 4500.00, 'https://cafe-kiosk-images.s3.ap-northeast-2.amazonaws.com/menu/strawberry-smoothie.jpg', TRUE, 3, NOW(), NOW()),
('녹차 라떼', '고소한 녹차 라떼', 4000.00, 'https://cafe-kiosk-images.s3.ap-northeast-2.amazonaws.com/menu/green-tea-latte.jpg', TRUE, 3, NOW(), NOW());
```

### Verify Your Changes

```sql
-- Check all menu items with their images
SELECT m.id, m.name, m.price, m.image_url, c.name as category
FROM menu_items m
JOIN categories c ON m.category_id = c.id
ORDER BY c.display_order, m.id;
```

---

## Part 4: Test on Your Website

1. **No restart needed!** Changes are immediate
2. Open your website: `http://13.125.244.172`
3. Browse menu items - images should now load from S3

---

## Troubleshooting

### Images not loading?

1. **Check S3 bucket policy** - Make sure it allows public read access
2. **Verify image URLs** - Copy URL from S3 and paste in browser to test
3. **Check browser console** - Open DevTools (F12) → Console tab for errors

### Can't connect to RDS?

1. **Check RDS Security Group** - Make sure your IP is allowed
2. **Verify credentials** - Confirm username/password are correct
3. **Test with command line**:
   ```bash
   mysql -h mydb.czwaweqgeexp.ap-northeast-2.rds.amazonaws.com -u admin -p mydb
   ```

### Images show broken?

1. **Check image file names** - Must match exactly (case-sensitive)
2. **Verify bucket name** in URLs
3. **Ensure images are in `menu/` folder** in S3

---

## Best Practices

✅ **Use lowercase and hyphens** for image filenames (e.g., `vanilla-latte.jpg`)
✅ **Optimize images** before uploading (compress to reduce size)
✅ **Use consistent dimensions** (e.g., all 800x800px)
✅ **Back up your database** before making changes
✅ **Keep bucket in same region** as RDS for faster loading

---

## Quick Reference

**Your S3 Bucket**: `cafe-kiosk-images`  
**Your RDS Host**: `mydb.czwaweqgeexp.ap-northeast-2.rds.amazonaws.com`  
**Database Name**: `mydb`  
**Username**: `admin`  
**Image URL Pattern**: `https://cafe-kiosk-images.s3.ap-northeast-2.amazonaws.com/menu/[filename].jpg`

---

## Next Steps

After updating images:
1. Test all menu items load correctly
2. Test on different devices (mobile/desktop)
3. Consider adding CloudFront CDN for faster global delivery
4. Monitor S3 costs in AWS Billing dashboard

---

**Need help?** Check AWS documentation or ask your team!
