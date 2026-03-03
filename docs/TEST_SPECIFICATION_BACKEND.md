# Backend Test Specification — Cafe Kiosk REST API
## テスト仕様書 (SES Style)

| Item | Detail |
|---|---|
| Document No. | TS-BACKEND-001 |
| Version | 2.0 |
| Created | 2026-03-03 |
| Last Updated | 2026-03-03 |
| Author | MKSS Team |
| Status | Draft |
| Target System | Spring Boot REST API (`cafe_kiosk-0.0.1-SNAPSHOT.jar`) |
| Base URL | `http://localhost:8080` |
| Test Tool | Postman v10 / curl |

---

## 1. Scope

This document specifies step-by-step test procedures, exact test data, and expected results for all REST API endpoints in the Cafe Kiosk backend system.

### 1.1 Endpoints In Scope

| # | Controller | HTTP Method | Endpoint | Description |
|---|---|---|---|---|
| 1 | CategoryController | GET | `/categories` | Get all categories |
| 2 | MenuController | GET | `/menu` | Get all available menu items |
| 3 | MenuController | GET | `/menu?categoryId={id}` | Get items by category |
| 4 | CartController | GET | `/cart` | View session cart |
| 5 | CartController | POST | `/cart/add` | Add item to session cart |
| 6 | CartController | POST | `/cart/clear` | Clear session cart |
| 7 | OrderController | POST | `/order/checkout` | Create order (body or session) |

### 1.2 Test Case Type

| Symbol | Type | Description |
|---|---|---|
| ✅ | Normal (正常系) | Valid input, expected happy path |
| ❌ | Abnormal (異常系) | Invalid input, boundary, error conditions |

### 1.3 Pass/Fail Criteria

| Verdict | Condition |
|---|---|
| **PASS** | HTTP status code, all specified response fields and values exactly match expected result |
| **FAIL** | Any deviation: wrong status code, missing field, wrong value, unexpected crash |

---

## 2. Test Environment

| Item | Value |
|---|---|
| OS | Windows 11 / Ubuntu 22.04 |
| JDK | 17+ |
| Framework | Spring Boot 3.x |
| Database | H2 in-memory (dev profile) |
| Session | HTTP Session (JSESSIONID cookie) |
| Test Tool | Postman v10 |
| Port | 8080 |
| Profile | `application-dev.yml` |

### 2.1 Postman Setup

1. Open Postman
2. Create a new Collection: `Cafe Kiosk Backend Tests`
3. Set Collection Variable: `baseUrl` = `http://localhost:8080`
4. Enable **"Automatically follow redirects"**: OFF
5. Enable **"Save cookies"**: ON (required for session-based cart tests)

---

## 3. Test Data

### 3.1 Pre-loaded Categories (inserted via application startup or H2 console)

| id | name | description | display_order |
|---|---|---|---|
| 1 | 커피 | 신선한 원두로 만든 커피 | 1 |
| 2 | 디저트 | 달콤한 디저트 | 2 |
| 3 | 음료 | 시원한 음료 | 3 |

### 3.2 Pre-loaded Menu Items

| id | name | price | available | category_id |
|---|---|---|---|---|
| 1 | 아메리카노 | 3000.00 | true | 1 |
| 2 | 카페라떼 | 3500.00 | true | 1 |
| 3 | 카푸치노 | 3500.00 | true | 1 |
| 4 | 바닐라 라떼 | 4000.00 | true | 1 |
| 5 | 초콜릿 케이크 | 5000.00 | true | 2 |
| 6 | 치즈케이크 | 5500.00 | true | 2 |
| 7 | 크루아상 | 3000.00 | true | 2 |
| 8 | 마카롱 | 2000.00 | true | 2 |
| 9 | 오렌지 주스 | 4000.00 | true | 3 |
| 10 | 딸기 스무디 | 4500.00 | true | 3 |
| 11 | 녹차 라떼 | 4000.00 | true | 3 |
| 12 | 아메리카노 (품절) | 3000.00 | **false** | 1 |

> ⚠️ Item id=12 is inserted specifically as `available=false` for abnormal test cases.

### 3.3 Request Body Templates

**Order Request Body (used in ORD tests):**
```json
{
  "customerName": "TestUser",
  "items": [
    {
      "menuItemId": 1,
      "menuItemName": "아메리카노",
      "price": 3000.00,
      "quantity": 2,
      "subtotal": 6000.00
    }
  ]
}
```

**Empty Cart Checkout Body:**
```json
{}
```

---

## 4. Category API — Test Cases

**Target Endpoint:** `GET /categories`  
**Expected Behavior:** Returns all categories ordered by `display_order` ASC.

---

### CAT-001 — Response status is 200 OK ✅

| Item | Detail |
|---|---|
| **Test Item** | Verify HTTP 200 is returned when categories exist |
| **Precondition** | Spring Boot application is running. Categories (커피, 디저트, 음료) are present in DB. |

**Test Procedure:**
1. Open Postman
2. Set method to `GET`
3. Set URL to `{{baseUrl}}/categories`
4. Click **Send**
5. Observe the HTTP status code in the response panel

**Expected Result:**
```
HTTP/1.1 200 OK
```

| Actual Result | Pass/Fail | Evidence |
|---|---|---|
| | | `CAT-001-evidence.png` |

---

### CAT-002 — Response body is a JSON array of 3 elements ✅

| Item | Detail |
|---|---|
| **Test Item** | Verify response body is a non-empty JSON array containing exactly 3 categories |
| **Precondition** | Same as CAT-001 |

**Test Procedure:**
1. Send `GET {{baseUrl}}/categories` (same as CAT-001)
2. In Postman, click **Body** tab → select **Pretty** view
3. Observe the root element type and count the array elements

**Expected Result:**
- Root element is a JSON array `[...]`
- Array contains exactly **3** elements

| Actual Result | Pass/Fail | Evidence |
|---|---|---|
| | | `CAT-002-evidence.png` |

---

### CAT-003 — Each category object contains required fields ✅

| Item | Detail |
|---|---|
| **Test Item** | Verify each category object has `id`, `name`, `description`, `displayOrder`; verify `menuItems` is NOT exposed |
| **Precondition** | Same as CAT-001 |

**Test Procedure:**
1. Send `GET {{baseUrl}}/categories`
2. Inspect the first element of the response array
3. Check each field listed in Expected Result

**Expected Result:**
```json
[
  {
    "id": 1,
    "name": "커피",
    "description": "신선한 원두로 만든 커피",
    "displayOrder": 1
  },
  ...
]
```
- Each object contains: `id` (number), `name` (string), `description` (string), `displayOrder` (number)
- `menuItems` field must **NOT** be present (`@JsonIgnore` applied)

| Actual Result | Pass/Fail | Evidence |
|---|---|---|
| | | `CAT-003-evidence.png` |

---

### CAT-004 — Categories are ordered by displayOrder ascending ✅

| Item | Detail |
|---|---|
| **Test Item** | Verify array is sorted: 커피(1) → 디저트(2) → 음료(3) |
| **Precondition** | Same as CAT-001 |

**Test Procedure:**
1. Send `GET {{baseUrl}}/categories`
2. Note the index position of each category in the returned array
3. Verify index 0 = 커피, index 1 = 디저트, index 2 = 음료

**Expected Result:**
- `response[0].name` = `"커피"`
- `response[1].name` = `"디저트"`
- `response[2].name` = `"음료"`

| Actual Result | Pass/Fail | Evidence |
|---|---|---|
| | | `CAT-004-evidence.png` |

---

## 5. Menu API — Test Cases

**Target Endpoint:** `GET /menu` / `GET /menu?categoryId={id}`

---

### MNU-001 — Get all menu items returns 200 OK ✅

| Item | Detail |
|---|---|
| **Test Item** | Verify HTTP 200 when no `categoryId` filter is applied |
| **Precondition** | Application running. At least 1 menu item with `available=true` in DB. |

**Test Procedure:**
1. Set method to `GET`
2. Set URL to `{{baseUrl}}/menu`
3. Click **Send**
4. Observe response status code

**Expected Result:**
```
HTTP/1.1 200 OK
```

| Actual Result | Pass/Fail | Evidence |
|---|---|---|
| | | `MNU-001-evidence.png` |

---

### MNU-002 — Response contains all 11 available items ✅

| Item | Detail |
|---|---|
| **Test Item** | Verify count of returned items = 11 (all `available=true` items) |
| **Precondition** | Test data from Section 3.2 loaded: 11 available items + 1 item with `available=false` (id=12). |

**Test Procedure:**
1. Send `GET {{baseUrl}}/menu`
2. Open **Body** → **Pretty** in Postman
3. Count the number of elements in the returned array
4. Search response body for `"id": 12`

**Expected Result:**
- Array length = **11**
- Item with `id=12` (`available=false`) is **not present** anywhere in the array

| Actual Result | Pass/Fail | Evidence |
|---|---|---|
| | | `MNU-002-evidence.png` |

---

### MNU-003 — Each menu item object contains required fields ✅

| Item | Detail |
|---|---|
| **Test Item** | Verify each item has correct field structure and types |
| **Precondition** | Same as MNU-001 |

**Test Procedure:**
1. Send `GET {{baseUrl}}/menu`
2. Inspect the first element of the response array (아메리카노, id=1)
3. Verify all fields listed in Expected Result are present

**Expected Result:**
```json
{
  "id": 1,
  "name": "아메리카노",
  "description": "깔끔한 에스프레소와 물",
  "price": 3000.00,
  "imageUrl": "https://...",
  "available": true,
  "category": {
    "id": 1,
    "name": "커피",
    "description": "신선한 원두로 만든 커피",
    "displayOrder": 1
  }
}
```
- All listed fields present with correct types
- `category` is an embedded object (not null)

| Actual Result | Pass/Fail | Evidence |
|---|---|---|
| | | `MNU-003-evidence.png` |

---

### MNU-004 — Filter by categoryId=1 returns only 커피 items ✅

| Item | Detail |
|---|---|
| **Test Item** | Verify filtering by `categoryId=1` returns only the 4 커피 items |
| **Precondition** | Category id=1 (커피) has 4 available items (id 1–4). |

**Test Procedure:**
1. Set method to `GET`
2. Set URL to `{{baseUrl}}/menu?categoryId=1`
3. Click **Send**
4. Count array elements and inspect each item's `category` field

**Expected Result:**
- HTTP 200
- Array length = **4**
- Every item: `category.id` = `1`, `category.name` = `"커피"`
- Item names present: 아메리카노, 카페라떼, 카푸치노, 바닐라 라떼

| Actual Result | Pass/Fail | Evidence |
|---|---|---|
| | | `MNU-004-evidence.png` |

---

### MNU-005 — Filter by categoryId=2 returns only 디저트 items ✅

| Item | Detail |
|---|---|
| **Test Item** | Verify filtering by `categoryId=2` returns only the 4 디저트 items |
| **Precondition** | Category id=2 (디저트) has 4 items (id 5–8). |

**Test Procedure:**
1. Set URL to `{{baseUrl}}/menu?categoryId=2`
2. Click **Send**
3. Verify all returned items belong to 디저트

**Expected Result:**
- HTTP 200
- Array length = **4**
- Every item: `category.name` = `"디저트"`
- Item names: 초콜릿 케이크, 치즈케이크, 크루아상, 마카롱

| Actual Result | Pass/Fail | Evidence |
|---|---|---|
| | | `MNU-005-evidence.png` |

---

### MNU-006 — Unavailable item is excluded from unfiltered results ✅

| Item | Detail |
|---|---|
| **Test Item** | Verify item with `available=false` (id=12) is not returned by `GET /menu` |
| **Precondition** | Item id=12 exists with `available=false` in DB. |

**Test Procedure:**
1. Send `GET {{baseUrl}}/menu`
2. Use Postman's search or manually inspect the array for any item with `"id": 12`

**Expected Result:**
- No item with `"id": 12` appears in the response array

| Actual Result | Pass/Fail | Evidence |
|---|---|---|
| | | `MNU-006-evidence.png` |

---

### MNU-007 — Non-existent categoryId returns empty array ❌

| Item | Detail |
|---|---|
| **Test Item** | Verify graceful empty result when `categoryId` does not match any category |
| **Precondition** | Category id=9999 does not exist in DB. |

**Test Procedure:**
1. Set URL to `{{baseUrl}}/menu?categoryId=9999`
2. Click **Send**
3. Observe response status and body

**Expected Result:**
```
HTTP/1.1 200 OK
Body: []
```

| Actual Result | Pass/Fail | Evidence |
|---|---|---|
| | | `MNU-007-evidence.png` |

---

### MNU-008 — Non-numeric categoryId returns 400 Bad Request ❌

| Item | Detail |
|---|---|
| **Test Item** | Verify type mismatch error when `categoryId` value cannot be parsed as `Long` |
| **Precondition** | Application running normally. |

**Test Procedure:**
1. Set URL to `{{baseUrl}}/menu?categoryId=abc`
2. Click **Send**
3. Observe response status code and body fields

**Expected Result:**
```
HTTP/1.1 400 Bad Request
```
```json
{
  "status": 400,
  "error": "Bad Request",
  "message": "<type mismatch description>",
  "path": "/menu",
  "timestamp": "<yyyy-MM-dd HH:mm:ss>"
}
```

| Actual Result | Pass/Fail | Evidence |
|---|---|---|
| | | `MNU-008-evidence.png` |

---

## 6. Cart API — Test Cases

> ⚠️ **Important:** The session cart is stored server-side via JSESSIONID cookie. All cart tests **within the same sub-section** must be run in the same Postman session. Where a fresh session is required, it is stated in the Precondition.

---

### 6.1 View Cart (`GET /cart`)

---

### CRT-001 — Empty session returns empty cart with cartTotal 0 ✅

| Item | Detail |
|---|---|
| **Test Item** | Verify new session returns `cartItems: []` and `cartTotal: 0` |
| **Precondition** | New Postman session — no existing JSESSIONID cookie (clear all cookies for `localhost`). |

**Test Procedure:**
1. In Postman, go to **Cookies** → clear all cookies for `localhost`
2. Set method to `GET`
3. Set URL to `{{baseUrl}}/cart`
4. Click **Send**
5. Observe response status code
6. Observe `cartItems` value in response body
7. Observe `cartTotal` value in response body

**Expected Result:**
```
HTTP/1.1 200 OK
```
```json
{
  "cartItems": [],
  "cartTotal": 0
}
```
- `cartItems` is an empty array `[]`, not `null`
- `cartTotal` is `0` (numeric), not `null` and not `"0"`

| Actual Result | Pass/Fail | Evidence |
|---|---|---|
| | | `CRT-001-evidence.png` |

---

### 6.2 Add to Cart (`POST /cart/add`)

---

### CRT-002 — Add item to empty cart returns success ✅

| Item | Detail |
|---|---|
| **Test Item** | Verify adding one item to empty session returns success response |
| **Precondition** | Fresh session (cookies cleared). MenuItem id=1 (아메리카노, ₩3000.00) exists in DB. |

**Test Procedure:**
1. Clear cookies in Postman
2. Set method to `POST`
3. Set URL to `{{baseUrl}}/cart/add?menuItemId=1&quantity=1`
4. No request body needed
5. Click **Send**
6. Observe response status and body

**Expected Result:**
```
HTTP/1.1 200 OK
```
```json
{
  "success": true,
  "message": "Item added to cart"
}
```

| Actual Result | Pass/Fail | Evidence |
|---|---|---|
| | | `CRT-002-evidence.png` |

---

### CRT-003 — Cart reflects correct item after add ✅

| Item | Detail |
|---|---|
| **Test Item** | Verify `GET /cart` shows the added item with correct name, price, quantity, and subtotal |
| **Precondition** | CRT-002 completed (아메리카노 × 1 in session). **Same session continued.** |

**Test Procedure:**
1. (Continue same Postman session from CRT-002 — do NOT clear cookies)
2. Set method to `GET`
3. Set URL to `{{baseUrl}}/cart`
4. Click **Send**
5. Inspect `cartItems[0]` in the response body
6. Inspect `cartTotal` value

**Expected Result:**
```json
{
  "cartItems": [
    {
      "menuItemId": 1,
      "menuItemName": "아메리카노",
      "price": 3000.00,
      "quantity": 1,
      "subtotal": 3000.00
    }
  ],
  "cartTotal": 3000.00
}
```

| Actual Result | Pass/Fail | Evidence |
|---|---|---|
| | | `CRT-003-evidence.png` |

---

### CRT-004 — Adding same item again increments quantity, no duplicate entry ✅

| Item | Detail |
|---|---|
| **Test Item** | Verify adding the same `menuItemId` again accumulates quantity (not a duplicate row) |
| **Precondition** | CRT-003 completed. Cart has 아메리카노 qty=1. **Same session.** |

**Test Procedure:**
1. Send `POST {{baseUrl}}/cart/add?menuItemId=1&quantity=2`
2. Send `GET {{baseUrl}}/cart`
3. Observe `cartItems` array length
4. Observe `cartItems[0].quantity`
5. Observe `cartItems[0].subtotal`
6. Observe `cartTotal`

**Expected Result:**
- `cartItems` array length = **1** (no duplicate entry)
- `cartItems[0].menuItemId` = `1`
- `cartItems[0].quantity` = **3** (1 + 2)
- `cartItems[0].subtotal` = **9000.00** (3000.00 × 3)
- `cartTotal` = **9000.00**

| Actual Result | Pass/Fail | Evidence |
|---|---|---|
| | | `CRT-004-evidence.png` |

---

### CRT-005 — Adding different item creates separate cart entry ✅

| Item | Detail |
|---|---|
| **Test Item** | Verify two different `menuItemId` values produce two distinct entries in `cartItems` |
| **Precondition** | Fresh session. MenuItem id=1 (아메리카노 ₩3000) and id=2 (카페라떼 ₩3500) exist. |

**Test Procedure:**
1. Clear cookies in Postman
2. Send `POST {{baseUrl}}/cart/add?menuItemId=1&quantity=1`
3. Send `POST {{baseUrl}}/cart/add?menuItemId=2&quantity=1`
4. Send `GET {{baseUrl}}/cart`
5. Observe `cartItems` array

**Expected Result:**
- `cartItems` length = **2**
- `cartItems[0]`: `menuItemId=1`, `quantity=1`, `subtotal=3000.00`
- `cartItems[1]`: `menuItemId=2`, `quantity=1`, `subtotal=3500.00`
- `cartTotal` = **6500.00**

| Actual Result | Pass/Fail | Evidence |
|---|---|---|
| | | `CRT-005-evidence.png` |

---

### CRT-006 — Default quantity is 1 when parameter is omitted ✅

| Item | Detail |
|---|---|
| **Test Item** | Verify `quantity` defaults to `1` when not provided in request |
| **Precondition** | Fresh session. MenuItem id=1 exists. |

**Test Procedure:**
1. Clear cookies
2. Send `POST {{baseUrl}}/cart/add?menuItemId=1` (no `quantity` parameter)
3. Send `GET {{baseUrl}}/cart`
4. Observe `cartItems[0].quantity` and `subtotal`

**Expected Result:**
- `cartItems[0].quantity` = **1**
- `cartItems[0].subtotal` = **3000.00**

| Actual Result | Pass/Fail | Evidence |
|---|---|---|
| | | `CRT-006-evidence.png` |

---

### CRT-007 — Non-existent menuItemId returns 404 Not Found ❌

| Item | Detail |
|---|---|
| **Test Item** | Verify `ResourceNotFoundException` is thrown when `menuItemId` does not exist in DB |
| **Precondition** | MenuItem id=9999 does not exist in DB. |

**Test Procedure:**
1. Set method to `POST`
2. Set URL to `{{baseUrl}}/cart/add?menuItemId=9999&quantity=1`
3. Click **Send**
4. Observe response status code
5. Observe all fields in the response body

**Expected Result:**
```
HTTP/1.1 404 Not Found
```
```json
{
  "status": 404,
  "error": "Not Found",
  "message": "MenuItem not found with id : '9999'",
  "path": "/cart/add",
  "timestamp": "<yyyy-MM-dd HH:mm:ss>"
}
```

| Actual Result | Pass/Fail | Evidence |
|---|---|---|
| | | `CRT-007-evidence.png` |

---

### CRT-008 — Missing menuItemId parameter returns 400 ❌

| Item | Detail |
|---|---|
| **Test Item** | Verify 400 error when required `menuItemId` parameter is absent |
| **Precondition** | Application running normally. |

**Test Procedure:**
1. Send `POST {{baseUrl}}/cart/add?quantity=1` (menuItemId omitted)
2. Observe response status and body

**Expected Result:**
```
HTTP/1.1 400 Bad Request
```
- Response body contains `"status": 400`
- Cart state is not modified

| Actual Result | Pass/Fail | Evidence |
|---|---|---|
| | | `CRT-008-evidence.png` |

---

### 6.3 Clear Cart (`POST /cart/clear`)

---

### CRT-009 — Clear cart with items returns success ✅

| Item | Detail |
|---|---|
| **Test Item** | Verify `POST /cart/clear` returns `{ success: true }` when cart has items |
| **Precondition** | Session cart has at least 1 item. (Run CRT-002 first if needed.) |

**Test Procedure:**
1. Ensure cart has items — send `POST {{baseUrl}}/cart/add?menuItemId=1&quantity=1` if needed
2. Set method to `POST`
3. Set URL to `{{baseUrl}}/cart/clear`
4. Click **Send**
5. Observe response status and body

**Expected Result:**
```
HTTP/1.1 200 OK
```
```json
{
  "success": true,
  "message": "Cart cleared"
}
```

| Actual Result | Pass/Fail | Evidence |
|---|---|---|
| | | `CRT-009-evidence.png` |

---

### CRT-010 — Cart is empty after clear ✅

| Item | Detail |
|---|---|
| **Test Item** | Verify `GET /cart` returns empty cart after `POST /cart/clear` |
| **Precondition** | CRT-009 completed successfully. **Same session.** |

**Test Procedure:**
1. (Continue session from CRT-009 — do NOT clear cookies)
2. Send `GET {{baseUrl}}/cart`
3. Observe `cartItems` and `cartTotal`

**Expected Result:**
```json
{
  "cartItems": [],
  "cartTotal": 0
}
```

| Actual Result | Pass/Fail | Evidence |
|---|---|---|
| | | `CRT-010-evidence.png` |

---

### CRT-011 — Clearing an already empty cart does not cause error (idempotent) ❌

| Item | Detail |
|---|---|
| **Test Item** | Verify clearing an empty session does not throw an exception |
| **Precondition** | Fresh session with no cart items. |

**Test Procedure:**
1. Clear cookies in Postman
2. Send `POST {{baseUrl}}/cart/clear`
3. Observe response status and body

**Expected Result:**
```
HTTP/1.1 200 OK
```
```json
{
  "success": true,
  "message": "Cart cleared"
}
```
- No 500 error; no exception thrown

| Actual Result | Pass/Fail | Evidence |
|---|---|---|
| | | `CRT-011-evidence.png` |

---

## 7. Order API — Test Cases

**Target Endpoint:** `POST /order/checkout`

---

### 7.1 Checkout with Request Body

---

### ORD-001 — Checkout with valid body returns 200 OK ✅

| Item | Detail |
|---|---|
| **Test Item** | Verify HTTP 200 with `success: true` when valid items array is sent in body |
| **Precondition** | Application running. MenuItem id=1 (아메리카노, ₩3000.00) exists in DB. |

**Test Procedure:**
1. Set method to `POST`
2. Set URL to `{{baseUrl}}/order/checkout`
3. Set header: `Content-Type: application/json`
4. Set request body (raw JSON):
```json
{
  "customerName": "TestUser",
  "items": [
    {
      "menuItemId": 1,
      "menuItemName": "아메리카노",
      "price": 3000.00,
      "quantity": 2,
      "subtotal": 6000.00
    }
  ]
}
```
5. Click **Send**
6. Observe response status code
7. Observe `success` field in response body

**Expected Result:**
```
HTTP/1.1 200 OK
```
```json
{
  "success": true,
  "order": { ... }
}
```

| Actual Result | Pass/Fail | Evidence |
|---|---|---|
| | | `ORD-001-evidence.png` |

---

### ORD-002 — Order number matches format `ORD-YYYYMMDD-XXXX` ✅

| Item | Detail |
|---|---|
| **Test Item** | Verify `order.orderNumber` matches the expected naming pattern |
| **Precondition** | ORD-001 completed. Use the same response. |

**Test Procedure:**
1. In the ORD-001 response, locate `response.order.orderNumber`
2. Check that its value matches the pattern
3. Verify the date portion matches today's date

**Expected Result:**
- `order.orderNumber` matches regex: `^ORD-\d{8}-\d{4}$`
- Example for today: `"ORD-20260303-0001"`
- Date portion = `"20260303"`

| Actual Result | Pass/Fail | Evidence |
|---|---|---|
| | | `ORD-002-evidence.png` |

---

### ORD-003 — Order totalAmount equals sum of item subtotals ✅

| Item | Detail |
|---|---|
| **Test Item** | Verify `order.totalAmount` = sum of all `subtotal` values sent in items array |
| **Precondition** | ORD-001 completed. Request had qty=2, subtotal=6000.00. |

**Test Procedure:**
1. In the ORD-001 response, locate `response.order.totalAmount`
2. Verify value and type

**Expected Result:**
- `order.totalAmount` = **6000.00**
- Type is numeric (not a string)

| Actual Result | Pass/Fail | Evidence |
|---|---|---|
| | | `ORD-003-evidence.png` |

---

### ORD-004 — Newly created order has status PENDING ✅

| Item | Detail |
|---|---|
| **Test Item** | Verify `order.status` is `"PENDING"` immediately after creation |
| **Precondition** | ORD-001 completed. |

**Test Procedure:**
1. In the ORD-001 response, locate `response.order.status`

**Expected Result:**
- `order.status` = `"PENDING"` (uppercase string)

| Actual Result | Pass/Fail | Evidence |
|---|---|---|
| | | `ORD-004-evidence.png` |

---

### ORD-005 — Order response reflects customerName from request ✅

| Item | Detail |
|---|---|
| **Test Item** | Verify `order.customerName` matches the value sent in the request body |
| **Precondition** | ORD-001 completed. Request had `"customerName": "TestUser"`. |

**Test Procedure:**
1. In the ORD-001 response, locate `response.order.customerName`

**Expected Result:**
- `order.customerName` = `"TestUser"`

| Actual Result | Pass/Fail | Evidence |
|---|---|---|
| | | `ORD-005-evidence.png` |

---

### ORD-006 — Order items array contains correct fields ✅

| Item | Detail |
|---|---|
| **Test Item** | Verify `order.items[0]` contains `menuItemName`, `price`, `quantity`, `subtotal` with correct values |
| **Precondition** | ORD-001 completed. |

**Test Procedure:**
1. In the ORD-001 response, locate `response.order.items`
2. Inspect `items[0]` for all four fields

**Expected Result:**
```json
"items": [
  {
    "menuItemName": "아메리카노",
    "price": 3000.00,
    "quantity": 2,
    "subtotal": 6000.00
  }
]
```
- Array length = **1**
- All four fields present with correct values and types

| Actual Result | Pass/Fail | Evidence |
|---|---|---|
| | | `ORD-006-evidence.png` |

---

### ORD-007 — orderedAt timestamp is present in ISO format ✅

| Item | Detail |
|---|---|
| **Test Item** | Verify `order.orderedAt` is present and uses `yyyy-MM-dd'T'HH:mm:ss` format |
| **Precondition** | ORD-001 completed. |

**Test Procedure:**
1. In the ORD-001 response, locate `response.order.orderedAt`

**Expected Result:**
- `order.orderedAt` is a non-null string
- Matches format: `"yyyy-MM-dd'T'HH:mm:ss"`
- Example: `"2026-03-03T14:30:00"`

| Actual Result | Pass/Fail | Evidence |
|---|---|---|
| | | `ORD-007-evidence.png` |

---

### ORD-008 — Multi-item order totalAmount is correctly summed ✅

| Item | Detail |
|---|---|
| **Test Item** | Verify `totalAmount` = sum of all line item subtotals when order has multiple items |
| **Precondition** | MenuItem id=1 (아메리카노 ₩3000) and id=9 (오렌지 주스 ₩4000) exist. |

**Test Procedure:**
1. Send `POST {{baseUrl}}/order/checkout` with body:
```json
{
  "customerName": "MultiTest",
  "items": [
    {
      "menuItemId": 1,
      "menuItemName": "아메리카노",
      "price": 3000.00,
      "quantity": 1,
      "subtotal": 3000.00
    },
    {
      "menuItemId": 9,
      "menuItemName": "오렌지 주스",
      "price": 4000.00,
      "quantity": 2,
      "subtotal": 8000.00
    }
  ]
}
```
2. Locate `order.items` and `order.totalAmount` in response

**Expected Result:**
- `order.items` length = **2**
- `order.totalAmount` = **11000.00** (3000 + 8000)

| Actual Result | Pass/Fail | Evidence |
|---|---|---|
| | | `ORD-008-evidence.png` |

---

### ORD-009 — Order number increments sequentially ✅

| Item | Detail |
|---|---|
| **Test Item** | Verify each new order gets a unique, incrementing 4-digit suffix |
| **Precondition** | At least 1 order already exists. Note the `orderNumber` suffix from ORD-001. |

**Test Procedure:**
1. Send another valid `POST {{baseUrl}}/order/checkout` (any valid body)
2. Compare the new `orderNumber` to the one from ORD-001

**Expected Result:**
- New `orderNumber` differs from previous
- The 4-digit suffix is incremented by 1
- Example: `ORD-20260303-0001` → `ORD-20260303-0002`

| Actual Result | Pass/Fail | Evidence |
|---|---|---|
| | | `ORD-009-evidence.png` |

---

### ORD-010 — Checkout without customerName is accepted ✅

| Item | Detail |
|---|---|
| **Test Item** | Verify `customerName` is optional — order is created when it is omitted |
| **Precondition** | MenuItem id=1 exists. |

**Test Procedure:**
1. Send `POST {{baseUrl}}/order/checkout` with body:
```json
{
  "items": [
    {
      "menuItemId": 1,
      "menuItemName": "아메리카노",
      "price": 3000.00,
      "quantity": 1,
      "subtotal": 3000.00
    }
  ]
}
```
2. Observe response status and `order.customerName`

**Expected Result:**
- HTTP 200
- `order.customerName` = `null` or field is absent
- Order is created successfully

| Actual Result | Pass/Fail | Evidence |
|---|---|---|
| | | `ORD-010-evidence.png` |

---

### 7.2 Checkout via Session Cart

---

### ORD-011 — Checkout with empty body uses session cart ✅

| Item | Detail |
|---|---|
| **Test Item** | Verify order is created from session cart when request body has no items |
| **Precondition** | Same Postman session active. Session cart contains 아메리카노 × 1 (added via `POST /cart/add`). |

**Test Procedure:**
1. Clear cookies in Postman
2. Send `POST {{baseUrl}}/cart/add?menuItemId=1&quantity=1`
3. Set method to `POST`, URL to `{{baseUrl}}/order/checkout`
4. Set header: `Content-Type: application/json`
5. Set body to `{}`
6. Click **Send**
7. Observe `order.items` and `order.totalAmount`

**Expected Result:**
- HTTP 200
- `success` = `true`
- `order.items[0].menuItemName` = `"아메리카노"`
- `order.totalAmount` = **3000.00**

| Actual Result | Pass/Fail | Evidence |
|---|---|---|
| | | `ORD-011-evidence.png` |

---

### ORD-012 — Session cart is cleared after successful session-based checkout ✅

| Item | Detail |
|---|---|
| **Test Item** | Verify `GET /cart` returns empty cart after checkout via session |
| **Precondition** | ORD-011 completed. **Same session.** |

**Test Procedure:**
1. (Continue session from ORD-011 — do NOT clear cookies)
2. Send `GET {{baseUrl}}/cart`
3. Observe `cartItems` and `cartTotal`

**Expected Result:**
```json
{
  "cartItems": [],
  "cartTotal": 0
}
```

| Actual Result | Pass/Fail | Evidence |
|---|---|---|
| | | `ORD-012-evidence.png` |

---

### 7.3 Checkout — Abnormal Cases

---

### ORD-013 — Empty session + no body returns 400 EmptyCartException ❌

| Item | Detail |
|---|---|
| **Test Item** | Verify `EmptyCartException` returns HTTP 400 with correct message |
| **Precondition** | Fresh session (no session cart). |

**Test Procedure:**
1. Clear cookies in Postman
2. Set method to `POST`
3. Set URL to `{{baseUrl}}/order/checkout`
4. Set header: `Content-Type: application/json`
5. Set body to `{}`
6. Click **Send**
7. Observe response status code
8. Observe all fields in response body

**Expected Result:**
```
HTTP/1.1 400 Bad Request
```
```json
{
  "status": 400,
  "error": "Bad Request",
  "message": "Cannot checkout with an empty cart",
  "path": "/order/checkout",
  "timestamp": "<yyyy-MM-dd HH:mm:ss>"
}
```

| Actual Result | Pass/Fail | Evidence |
|---|---|---|
| | | `ORD-013-evidence.png` |

---

### ORD-014 — Non-existent menuItemId in body returns 404 ❌

| Item | Detail |
|---|---|
| **Test Item** | Verify `ResourceNotFoundException` is thrown for unknown `menuItemId` in order body |
| **Precondition** | MenuItem id=9999 does not exist in DB. |

**Test Procedure:**
1. Send `POST {{baseUrl}}/order/checkout` with body:
```json
{
  "customerName": "ErrorTest",
  "items": [
    {
      "menuItemId": 9999,
      "menuItemName": "존재하지않는메뉴",
      "price": 1000.00,
      "quantity": 1,
      "subtotal": 1000.00
    }
  ]
}
```
2. Observe response status and body

**Expected Result:**
```
HTTP/1.1 404 Not Found
```
```json
{
  "status": 404,
  "error": "Not Found",
  "message": "MenuItem not found with id : '9999'",
  "path": "/order/checkout",
  "timestamp": "<yyyy-MM-dd HH:mm:ss>"
}
```
- No order is saved to DB (confirm via no increment in order number sequence)

| Actual Result | Pass/Fail | Evidence |
|---|---|---|
| | | `ORD-014-evidence.png` |

---

### ORD-015 — Explicit `items: []` in body returns 400 ❌

| Item | Detail |
|---|---|
| **Test Item** | Verify empty `items` array falls through to session cart (also empty) → `EmptyCartException` |
| **Precondition** | Fresh session. |

**Test Procedure:**
1. Clear cookies
2. Send `POST {{baseUrl}}/order/checkout` with body:
```json
{
  "customerName": "TestUser",
  "items": []
}
```
3. Observe response

**Expected Result:**
- HTTP 400
- `message` = `"Cannot checkout with an empty cart"`

| Actual Result | Pass/Fail | Evidence |
|---|---|---|
| | | `ORD-015-evidence.png` |

---

## 8. Global Exception Handler — Test Cases

---

### EXC-001 — Error response contains all required fields ✅

| Item | Detail |
|---|---|
| **Test Item** | Verify `ErrorResponse` object always contains: `timestamp`, `status`, `error`, `message`, `path` |
| **Precondition** | Trigger any error — reuse the response from ORD-013 (`EmptyCartException`). |

**Test Procedure:**
1. Use the response from ORD-013
2. Verify each of the following fields exists

**Expected Result:**

| Field | Type | Example Value |
|---|---|---|
| `timestamp` | string | `"2026-03-03 14:30:00"` |
| `status` | number | `400` |
| `error` | string | `"Bad Request"` |
| `message` | string | `"Cannot checkout with an empty cart"` |
| `path` | string | `"/order/checkout"` |

| Actual Result | Pass/Fail | Evidence |
|---|---|---|
| | | `EXC-001-evidence.png` |

---

### EXC-002 — Timestamp format is `yyyy-MM-dd HH:mm:ss` ✅

| Item | Detail |
|---|---|
| **Test Item** | Verify `timestamp` uses space-separated format, not ISO T-separator |
| **Precondition** | Any error response (e.g. ORD-013). |

**Test Procedure:**
1. Locate `timestamp` field in any error response
2. Check string format

**Expected Result:**
- `timestamp` matches pattern: `\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}`
- Example: `"2026-03-03 14:30:00"`
- Must **NOT** contain `T` separator (not `"2026-03-03T14:30:00"`)

| Actual Result | Pass/Fail | Evidence |
|---|---|---|
| | | `EXC-002-evidence.png` |

---

### EXC-003 — Java stack trace is NOT exposed in error response ✅

| Item | Detail |
|---|---|
| **Test Item** | Verify no Java stack trace or internal class names appear in error response body |
| **Precondition** | Any error response (400 or 404). |

**Test Procedure:**
1. Use any error response body
2. Search the raw JSON text for: `"at MKSS."`, `"java.lang"`, `"Caused by:"`, `"Exception"`

**Expected Result:**
- None of the above strings are present in the response body
- Only the structured `ErrorResponse` JSON fields are present

| Actual Result | Pass/Fail | Evidence |
|---|---|---|
| | | `EXC-003-evidence.png` |

---

## 9. Data Integrity — Test Cases

---

### DAT-001 — price field has 2 decimal places ✅

| Item | Detail |
|---|---|
| **Test Item** | Verify `price` in menu response uses `BigDecimal` precision: 2 decimal places |
| **Precondition** | MenuItem id=1 (아메리카노, price=3000.00) in DB. |

**Test Procedure:**
1. Send `GET {{baseUrl}}/menu`
2. Locate item `id=1`
3. Inspect `price` value and format

**Expected Result:**
- `price` = `3000.00` (numeric, 2 decimal places)
- Must **not** be `3000` (no decimals) or `"3000.00"` (string)

| Actual Result | Pass/Fail | Evidence |
|---|---|---|
| | | `DAT-001-evidence.png` |

---

### DAT-002 — Cart subtotal equals price × quantity ✅

| Item | Detail |
|---|---|
| **Test Item** | Verify `subtotal` in `GET /cart` = `price × quantity` |
| **Precondition** | Fresh session. MenuItem id=2 (카페라떼, ₩3500.00) exists. |

**Test Procedure:**
1. Clear cookies
2. Send `POST {{baseUrl}}/cart/add?menuItemId=2&quantity=3`
3. Send `GET {{baseUrl}}/cart`
4. Locate `cartItems[0].price`, `cartItems[0].quantity`, `cartItems[0].subtotal`, `cartTotal`

**Expected Result:**
- `price` = `3500.00`
- `quantity` = `3`
- `subtotal` = **10500.00** (3500.00 × 3)
- `cartTotal` = **10500.00**

| Actual Result | Pass/Fail | Evidence |
|---|---|---|
| | | `DAT-002-evidence.png` |

---

### DAT-003 — Order is persisted after checkout ✅

| Item | Detail |
|---|---|
| **Test Item** | Verify the order count in DB increases by 1 after each successful checkout |
| **Precondition** | At least 1 prior order exists. Note the suffix number from a previous order. |

**Test Procedure:**
1. Note the 4-digit suffix from the most recent `orderNumber` (e.g., `0003`)
2. Place a new order via `POST {{baseUrl}}/order/checkout` with valid body
3. Note the new `orderNumber` suffix

**Expected Result:**
- New suffix = previous suffix + 1 (e.g., `0004`)
- Confirms order was persisted in DB

| Actual Result | Pass/Fail | Evidence |
|---|---|---|
| | | `DAT-003-evidence.png` |

---

## 10. Test Execution Order (Recommended)

```
1.  CAT-001 → CAT-004          (No session dependency)
2.  MNU-001 → MNU-008          (No session dependency)
3.  CRT-001                    (Fresh session — view empty cart)
4.  CRT-002 → CRT-006          (Continuous session — add items)
5.  CRT-007 → CRT-008          (Independent — error cases)
6.  CRT-009 → CRT-011          (New session → add items → clear)
7.  ORD-001 → ORD-010          (Independent body-based orders)
8.  ORD-011 → ORD-012          (Fresh session → session cart checkout)
9.  ORD-013 → ORD-015          (Fresh session — error cases)
10. EXC-001 → EXC-003          (Use responses collected above)
11. DAT-001 → DAT-003          (Data verification)
```

---

## 11. Test Results Summary

| Section | Case IDs | Total | Passed | Failed | Not Tested |
|---|---|---|---|---|---|
| Category API | CAT-001 ~ CAT-004 | 4 | | | |
| Menu API | MNU-001 ~ MNU-008 | 8 | | | |
| Cart — View | CRT-001 | 1 | | | |
| Cart — Add | CRT-002 ~ CRT-008 | 7 | | | |
| Cart — Clear | CRT-009 ~ CRT-011 | 3 | | | |
| Order — Body | ORD-001 ~ ORD-010 | 10 | | | |
| Order — Session | ORD-011 ~ ORD-012 | 2 | | | |
| Order — Abnormal | ORD-013 ~ ORD-015 | 3 | | | |
| Exception Handler | EXC-001 ~ EXC-003 | 3 | | | |
| Data Integrity | DAT-001 ~ DAT-003 | 3 | | | |
| **Total** | | **44** | | | |

---

## 12. Defect Log

| Defect No. | Test Case | Severity | Description | Steps to Reproduce | Status | Assignee | Reported Date |
|---|---|---|---|---|---|---|---|
| — | — | — | — | — | — | — | — |

> Severity: **Critical** (system unusable) / **Major** (core function broken) / **Minor** (non-critical) / **Trivial**

---

## 13. Evidence File Naming Convention

All screenshot evidence files should be saved as:  
`<TestCaseID>-evidence.png`  
Example: `ORD-001-evidence.png`

Store in: `docs/test-evidence/backend/`

---

## 14. Sign-off

| Role | Name | Signature | Date |
|---|---|---|---|
| Test Lead | | | |
| Developer | | | |
| Reviewer | | | |
