# Frontend Test Specification — Cafe Kiosk React UI
## テスト仕様書 (SES Style)

| Item | Detail |
|---|---|
| Document No. | TS-FRONTEND-001 |
| Version | 2.0 |
| Created | 2026-03-03 |
| Last Updated | 2026-03-03 |
| Author | MKSS Team |
| Status | Draft |
| Target System | React 18 + TypeScript + Vite (frontend) |
| Base URL | `http://localhost:5173` |
| Backend URL | `http://localhost:8080` |

---

## 1. Scope

This document specifies step-by-step test procedures, exact expected UI states, and pass/fail criteria for all pages, components, and state management behaviors in the Cafe Kiosk frontend application.

### 1.1 Pages & Components Under Test

| # | Route | Component(s) | Description |
|---|---|---|---|
| 1 | `/` | `Home` | Landing page with cafe image |
| 2 | `/menu` | `MenuList` | Menu display, all categories |
| 3 | `/menu?category={name}` | `MenuList` | Menu filtered by category via URL query |
| 4 | `/cart` | `CartPage`, `Cart`, `CartItem` | Cart review, quantity edit, checkout |
| 5 | `/order-complete` | `OrderCompletePage`, `OrderComplete` | Post-checkout confirmation |
| — | Global | `CartContext` / `CartProvider` | add, remove, updateQuantity, clearCart, totals, localStorage |
| — | Global | `Navbar` | Top navigation bar |

### 1.2 Test Type Legend

| Symbol | Type | Description |
|---|---|---|
| ✅ | Normal (正常系) | Valid input, expected happy path |
| ❌ | Abnormal (異常系) | Invalid input, boundary, error condition |

### 1.3 Pass/Fail Criteria

| Verdict | Condition |
|---|---|
| **PASS** | UI renders, behaves, and displays text/values exactly as specified |
| **FAIL** | Any visual defect, wrong text, incorrect state, wrong navigation, crash, or missing element |

---

## 2. Test Environment

| Item | Value |
|---|---|
| Framework | React 18 + TypeScript |
| Build Tool | Vite |
| Routing | React Router v6 |
| State Management | React Context API (`CartContext`) |
| Persistence | `localStorage` key: `"cart"` |
| Styling | styled-components + Bootstrap 5 |
| Browser | Chrome (latest stable) |
| DevTools | Chrome DevTools (Application → Local Storage) |
| Resolution (default) | 1280×800 |
| Backend | Spring Boot on `http://localhost:8080` |

### 2.1 Test Setup

1. Start the backend: `cd backend && mvn spring-boot:run`
2. Start the frontend dev server: `cd frontend && npm run dev`
3. Open Chrome and navigate to `http://localhost:5173`
4. Open Chrome DevTools (F12)
5. On the **Application** tab → **Local Storage** → `http://localhost:5173` — monitor `cart` key throughout tests

---

## 3. Test Data

### 3.1 Menu Items Used in Tests (sourced from backend DB)

| id | name | price | category |
|---|---|---|---|
| 1 | 아메리카노 | ₩3,000 | 커피 |
| 2 | 카페라떼 | ₩3,500 | 커피 |
| 9 | 오렌지 주스 | ₩4,000 | 음료 |

### 3.2 Cart State Examples

**Single item cart:**
```json
[
  {
    "menuItemId": 1,
    "menuItemName": "아메리카노",
    "price": 3000,
    "quantity": 1,
    "subtotal": 3000
  }
]
```

**Two item cart:**
```json
[
  { "menuItemId": 1, "menuItemName": "아메리카노", "price": 3000, "quantity": 1, "subtotal": 3000 },
  { "menuItemId": 2, "menuItemName": "카페라떼", "price": 3500, "quantity": 2, "subtotal": 7000 }
]
```

### 3.3 Seeding localStorage Manually (for Context tests)

In Chrome DevTools Console, run:
```javascript
localStorage.setItem('cart', JSON.stringify([
  { menuItemId: 1, menuItemName: '아메리카노', price: 3000, quantity: 1, subtotal: 3000 }
]));
location.reload();
```

---

## 4. Routing — Test Cases

---

### RTE-001 — Navigate to `/` renders Home page ✅

| Item | Detail |
|---|---|
| **Test Item** | Verify the root route renders the `Home` component |
| **Precondition** | Both frontend and backend servers are running. Browser open at `http://localhost:5173`. |

**Test Procedure:**
1. Open Chrome and navigate to `http://localhost:5173/`
2. Observe the page content area below the Navbar

**Expected Result:**
- Page renders without error
- A full-width cafe image is visible (height approximately 80% of viewport)
- No JavaScript errors in DevTools Console

| Actual Result | Pass/Fail | Evidence |
|---|---|---|
| | | `RTE-001-evidence.png` |

---

### RTE-002 — Navigate to `/menu` renders MenuList page ✅

| Item | Detail |
|---|---|
| **Test Item** | Verify `/menu` route renders `MenuList` with loading state then menu items |
| **Precondition** | Backend running. Menu items exist in DB. |

**Test Procedure:**
1. Navigate to `http://localhost:5173/menu`
2. Observe immediately (within first 500ms)
3. Wait for loading to complete
4. Observe final rendered state

**Expected Result:**
- Step 2: Text `"Loading menu..."` is briefly displayed
- Step 4: Category tab bar and menu item cards are visible
- No JavaScript errors in Console

| Actual Result | Pass/Fail | Evidence |
|---|---|---|
| | | `RTE-002-evidence.png` |

---

### RTE-003 — Navigate to `/cart` renders CartPage ✅

| Item | Detail |
|---|---|
| **Test Item** | Verify `/cart` route renders `CartPage` regardless of cart state |
| **Precondition** | Frontend running. Cart may be empty or have items. |

**Test Procedure:**
1. Navigate to `http://localhost:5173/cart`
2. Observe the page content area

**Expected Result:**
- Page renders without crash
- Either cart items table OR the empty cart message `"장바구니가 비어 있습니다."` is shown
- `"주문하기"` button is visible in both cases

| Actual Result | Pass/Fail | Evidence |
|---|---|---|
| | | `RTE-003-evidence.png` |

---

### RTE-004 — Direct navigation to `/order-complete` without state redirects to `/` ❌

| Item | Detail |
|---|---|
| **Test Item** | Verify guard in `OrderCompletePage` redirects to `/` when no order state is present |
| **Precondition** | Frontend running. No recent checkout performed (no location.state). |

**Test Procedure:**
1. Open a new tab
2. Navigate directly to `http://localhost:5173/order-complete`
3. Observe immediately

**Expected Result:**
- Browser is immediately redirected to `http://localhost:5173/`
- Home page is displayed
- The order-complete page content is **never** shown
- No JavaScript error in Console

| Actual Result | Pass/Fail | Evidence |
|---|---|---|
| | | `RTE-004-evidence.png` |

---

### RTE-005 — `/menu?category=커피` highlights 커피 tab and filters items ✅

| Item | Detail |
|---|---|
| **Test Item** | Verify URL query param `category` drives tab selection and item filtering |
| **Precondition** | Backend running. 커피 category has 4 items. |

**Test Procedure:**
1. Navigate to `http://localhost:5173/menu?category=커피`
2. Observe the category tab bar
3. Observe the displayed menu items

**Expected Result:**
- The `"커피"` tab button has green background (`#2d6a4f`) and white text
- Only 커피 items are shown (4 items: 아메리카노, 카페라떼, 카푸치노, 바닐라 라떼)
- `"전체"` tab is NOT highlighted

| Actual Result | Pass/Fail | Evidence |
|---|---|---|
| | | `RTE-005-evidence.png` |

---

## 5. Home Page — Test Cases

**Component:** `Home` | **Route:** `/`

---

### HOM-001 — Cafe image renders at full width with 80vh height ✅

| Item | Detail |
|---|---|
| **Test Item** | Verify the styled `<img>` element fills the container with correct dimensions |
| **Precondition** | Frontend running. Internet connection available (S3 URL accessible). |

**Test Procedure:**
1. Navigate to `http://localhost:5173/`
2. Right-click the image → **Inspect**
3. In DevTools Elements panel, observe computed styles of the `<img>` tag

**Expected Result:**
- Image `width` computed style = `100%` of container
- Image `height` computed style = `80vh`
- Image `object-fit` = `cover`
- Image `src` contains `cafe2.jpg` (S3 URL)

| Actual Result | Pass/Fail | Evidence |
|---|---|---|
| | | `HOM-001-evidence.png` |

---

### HOM-002 — Page renders without crash when image fails to load ❌

| Item | Detail |
|---|---|
| **Test Item** | Verify no JavaScript crash occurs when the S3 image is unreachable |
| **Precondition** | Frontend running. Simulate network offline via DevTools. |

**Test Procedure:**
1. Open DevTools → **Network** tab → set throttle to **Offline**
2. Navigate to `http://localhost:5173/`
3. Observe the page

**Expected Result:**
- Page renders without a JavaScript error or blank white screen
- Broken image icon or empty space shown where image would be
- No error boundary triggered
- DevTools Console shows no uncaught exceptions

| Actual Result | Pass/Fail | Evidence |
|---|---|---|
| | | `HOM-002-evidence.png` |

---

## 6. Menu Page — Test Cases

**Component:** `MenuList` | **Route:** `/menu`

---

### MNU-001 — "Loading menu..." text shown during fetch ✅

| Item | Detail |
|---|---|
| **Test Item** | Verify loading state text appears before data arrives |
| **Precondition** | Backend running. Throttle network to **Slow 3G** in DevTools to make loading visible. |

**Test Procedure:**
1. Open DevTools → **Network** → set to **Slow 3G**
2. Navigate to `http://localhost:5173/menu`
3. Observe the page content immediately after navigation

**Expected Result:**
- Text `"Loading menu..."` is visible inside the styled container
- No menu cards are shown yet

| Actual Result | Pass/Fail | Evidence |
|---|---|---|
| | | `MNU-001-evidence.png` |

---

### MNU-002 — All menu items render after data loads ✅

| Item | Detail |
|---|---|
| **Test Item** | Verify all 11 available menu items are displayed after successful fetch |
| **Precondition** | Backend running with 11 available items. Network throttle removed. |

**Test Procedure:**
1. Navigate to `http://localhost:5173/menu`
2. Wait for loading to complete
3. Count the total number of menu cards displayed on the page

**Expected Result:**
- Exactly **11** menu item cards are displayed
- Loading text is no longer visible

| Actual Result | Pass/Fail | Evidence |
|---|---|---|
| | | `MNU-002-evidence.png` |

---

### MNU-003 — Each menu card displays name, price with ₩ prefix, and + badge ✅

| Item | Detail |
|---|---|
| **Test Item** | Verify each MenuCard contains all three required UI elements |
| **Precondition** | Menu loaded (MNU-002 completed). |

**Test Procedure:**
1. Inspect the first menu card (아메리카노)
2. Verify the item name text
3. Verify the price text format
4. Verify the `+` badge is visible

**Expected Result:**
- Name text: `"아메리카노"`
- Price text: `"₩3,000"` (₩ prefix + comma-separated Korean number format)
- Green circular `+` badge visible in bottom-right corner of card
- Item image visible (or placeholder if no `imageUrl`)

| Actual Result | Pass/Fail | Evidence |
|---|---|---|
| | | `MNU-003-evidence.png` |

---

### MNU-004 — "Failed to load menu items." shown when backend is unreachable ❌

| Item | Detail |
|---|---|
| **Test Item** | Verify error state message is shown when the API call fails |
| **Precondition** | Frontend running. Backend server is **stopped**. |

**Test Procedure:**
1. Stop the backend server
2. Navigate to `http://localhost:5173/menu`
3. Wait 5 seconds
4. Observe the page content

**Expected Result:**
- Text `"Failed to load menu items."` is displayed inside the container
- No menu cards are shown
- No JavaScript crash; page does not go blank

| Actual Result | Pass/Fail | Evidence |
|---|---|---|
| | | `MNU-004-evidence.png` |

---

### MNU-005 — "전체" tab is selected and all items grouped by category on initial load ✅

| Item | Detail |
|---|---|
| **Test Item** | Verify default view shows all items with category headers |
| **Precondition** | Navigate to `/menu` (no query param). |

**Test Procedure:**
1. Navigate to `http://localhost:5173/menu`
2. Wait for data to load
3. Observe the tab bar
4. Observe the item grouping

**Expected Result:**
- `"전체"` tab has green background (`#2d6a4f`) and white text
- All other category tabs have white background
- Category heading each (e.g., `"커피"`, `"디저트"`, `"음료"`) appears above its group of cards
- Each heading has a left green border (`4px solid #2d6a4f`)

| Actual Result | Pass/Fail | Evidence |
|---|---|---|
| | | `MNU-005-evidence.png` |

---

### MNU-006 — Clicking a category tab filters items and updates URL ✅

| Item | Detail |
|---|---|
| **Test Item** | Verify clicking `"커피"` tab filters menu and changes URL to `/menu?category=커피` |
| **Precondition** | `/menu` loaded, `"전체"` tab selected. |

**Test Procedure:**
1. On `/menu`, locate the `"커피"` tab button
2. Click the `"커피"` tab
3. Observe the browser URL bar
4. Observe the displayed items
5. Observe tab highlight state

**Expected Result:**
- URL changes to `http://localhost:5173/menu?category=%EC%BB%A4%ED%94%BC` (encoded `커피`)
- Only 커피 category items shown (4 cards)
- `"커피"` tab has green background; other tabs have white background
- Category heading `"커피"` is shown above the grid

| Actual Result | Pass/Fail | Evidence |
|---|---|---|
| | | `MNU-006-evidence.png` |

---

### MNU-007 — Clicking "전체" tab from a category view restores all items ✅

| Item | Detail |
|---|---|
| **Test Item** | Verify clicking `"전체"` from a filtered view navigates back to `/menu` |
| **Precondition** | MNU-006 completed. Currently on `/menu?category=커피`. |

**Test Procedure:**
1. From `커피` filtered view, click the `"전체"` tab
2. Observe the URL
3. Observe the displayed content

**Expected Result:**
- URL changes to `http://localhost:5173/menu`
- All 11 items displayed grouped under category headings
- `"전체"` tab highlighted green

| Actual Result | Pass/Fail | Evidence |
|---|---|---|
| | | `MNU-007-evidence.png` |

---

### MNU-008 — Clicking a menu card adds item to cart and shows toast ✅

| Item | Detail |
|---|---|
| **Test Item** | Verify clicking a MenuCard calls `addToCart` and displays the toast notification |
| **Precondition** | `/menu` loaded. Cart is empty. |

**Test Procedure:**
1. Note the cart count before clicking (should be 0)
2. Click the `"아메리카노"` menu card
3. Observe the bottom-right corner of the screen immediately
4. Read the toast message text

**Expected Result:**
- Toast appears at bottom-right with green background
- Toast text: `"아메리카노이(가) 장바구니에 추가되었습니다"` with `✓` prefix
- Toast visible for approximately 2 seconds then disappears

| Actual Result | Pass/Fail | Evidence |
|---|---|---|
| | | `MNU-008-evidence.png` |

---

### MNU-009 — Toast disappears automatically after 2 seconds ✅

| Item | Detail |
|---|---|
| **Test Item** | Verify toast auto-hides after 2000ms |
| **Precondition** | MNU-008 completed. Toast is currently visible. |

**Test Procedure:**
1. Immediately after MNU-008, start a stopwatch
2. Observe the moment the toast disappears
3. Record the elapsed time

**Expected Result:**
- Toast disappears approximately **2 seconds** (2000ms) after appearing
- Toast uses CSS transition (`translateY` + `opacity`), not an abrupt removal

| Actual Result | Pass/Fail | Evidence |
|---|---|---|
| | | `MNU-009-evidence.png` |

---

### MNU-010 — Clicking same card twice results in quantity 2 in cart ✅

| Item | Detail |
|---|---|
| **Test Item** | Verify that clicking the same menu card twice accumulates quantity (no duplicate entry) |
| **Precondition** | Cart is empty. Menu loaded. |

**Test Procedure:**
1. Clear `localStorage` via DevTools → Application → Clear
2. Reload `/menu`
3. Click the `"아메리카노"` card once
4. Click the `"아메리카노"` card a second time
5. Open DevTools → Application → Local Storage → inspect `cart` value

**Expected Result:**
- `localStorage["cart"]` contains exactly **1 item** (no duplicate)
- That item: `"menuItemId": 1`, `"quantity": 2`, `"subtotal": 6000`

| Actual Result | Pass/Fail | Evidence |
|---|---|---|
| | | `MNU-010-evidence.png` |

---

### MNU-011 — Menu card hover raises card and scales + badge ✅

| Item | Detail |
|---|---|
| **Test Item** | Verify CSS hover animation on MenuCard |
| **Precondition** | Menu loaded. |

**Test Procedure:**
1. Hover the mouse cursor over any menu card
2. Observe the card's vertical position and shadow
3. Observe the green `+` badge

**Expected Result:**
- Card visually lifts upward (`transform: translateY(-8px)`)
- Card shadow becomes larger/darker
- `+` badge slightly enlarges (`transform: scale(1.1)`) and darkens to `#1b4332`
- Transition is smooth (not instant)

| Actual Result | Pass/Fail | Evidence |
|---|---|---|
| | | `MNU-011-evidence.png` |

---

## 7. CartContext — Test Cases

> **Note:** These tests verify state management logic. Test via UI interactions, then confirm via `localStorage` in DevTools → Application tab.

---

### CTC-001 — addToCart adds new item to empty cart ✅

| Item | Detail |
|---|---|
| **Test Item** | Verify `addToCart` creates a new cart entry with correct `menuItemId`, `price`, `quantity`, `subtotal` |
| **Precondition** | `localStorage["cart"]` is empty or cleared. |

**Test Procedure:**
1. Open DevTools → Application → Local Storage → clear `cart` key
2. Reload `http://localhost:5173/menu`
3. Click the `"아메리카노"` card (price ₩3,000)
4. Open DevTools → Application → Local Storage → inspect `cart` value

**Expected Result:**
- `localStorage["cart"]` is a valid JSON array with 1 element
- Element fields:
  - `menuItemId` = `1`
  - `menuItemName` = `"아메리카노"`
  - `price` = `3000`
  - `quantity` = `1`
  - `subtotal` = `3000`

| Actual Result | Pass/Fail | Evidence |
|---|---|---|
| | | `CTC-001-evidence.png` |

---

### CTC-002 — addToCart accumulates quantity for duplicate item ✅

| Item | Detail |
|---|---|
| **Test Item** | Verify adding the same item again increases `quantity` and recalculates `subtotal`; no duplicate entry |
| **Precondition** | CTC-001 completed. Cart has 아메리카노 qty=1. |

**Test Procedure:**
1. Click the `"아메리카노"` card a second time
2. Inspect `localStorage["cart"]`

**Expected Result:**
- Array length remains **1** (no duplicate)
- `quantity` = `2`
- `subtotal` = `6000` (3000 × 2)

| Actual Result | Pass/Fail | Evidence |
|---|---|---|
| | | `CTC-002-evidence.png` |

---

### CTC-003 — addToCart creates separate entries for different items ✅

| Item | Detail |
|---|---|
| **Test Item** | Verify two different items produce two separate entries in the cart array |
| **Precondition** | Cart cleared. |

**Test Procedure:**
1. Clear `localStorage["cart"]` and reload
2. Click `"아메리카노"` card (id=1, ₩3,000)
3. Click `"카페라떼"` card (id=2, ₩3,500)
4. Inspect `localStorage["cart"]`

**Expected Result:**
- Array length = **2**
- Element 0: `menuItemId=1`, `quantity=1`, `subtotal=3000`
- Element 1: `menuItemId=2`, `quantity=1`, `subtotal=3500`

| Actual Result | Pass/Fail | Evidence |
|---|---|---|
| | | `CTC-003-evidence.png` |

---

### CTC-004 — removeFromCart removes the correct item ✅

| Item | Detail |
|---|---|
| **Test Item** | Verify `removeFromCart` removes only the targeted item; other items remain |
| **Precondition** | Cart has 2 items (아메리카노 and 카페라떼) from CTC-003. |

**Test Procedure:**
1. Navigate to `http://localhost:5173/cart`
2. Locate the `"아메리카노"` row in the cart table
3. Click the `"삭제"` button in that row
4. Observe the cart table
5. Inspect `localStorage["cart"]`

**Expected Result:**
- `"아메리카노"` row is removed from the table immediately
- `"카페라떼"` row remains
- `localStorage["cart"]` contains only 1 element with `menuItemId=2`

| Actual Result | Pass/Fail | Evidence |
|---|---|---|
| | | `CTC-004-evidence.png` |

---

### CTC-005 — updateQuantity recalculates subtotal correctly ✅

| Item | Detail |
|---|---|
| **Test Item** | Verify changing quantity in CartItem updates `subtotal` = `price × newQty` |
| **Precondition** | Cart has 아메리카노 qty=1 (price=3000). Navigate to `/cart`. |

**Test Procedure:**
1. Navigate to `http://localhost:5173/cart`
2. Locate the `"아메리카노"` quantity input field (currently shows `1`)
3. Clear the input and type `3`
4. Press Tab or click elsewhere to trigger `onChange`
5. Observe the `"소계"` cell for 아메리카노
6. Observe the footer `"총액"` value
7. Inspect `localStorage["cart"]`

**Expected Result:**
- `"소계"` cell shows `"9,000원"` (3000 × 3)
- Footer `"총액"` = `"9,000원"`
- `localStorage["cart"][0].quantity` = `3`
- `localStorage["cart"][0].subtotal` = `9000`

| Actual Result | Pass/Fail | Evidence |
|---|---|---|
| | | `CTC-005-evidence.png` |

---

### CTC-006 — updateQuantity to 0 removes the item from cart ❌

| Item | Detail |
|---|---|
| **Test Item** | Verify setting quantity to `0` triggers `removeFromCart` (quantity ≤ 0 → remove) |
| **Precondition** | Cart has 아메리카노 qty=1. On `/cart` page. |

**Test Procedure:**
1. Locate the 아메리카노 quantity input
2. Clear the input and type `0`
3. Press Tab to trigger `onChange`
4. Observe the cart table

**Expected Result:**
- 아메리카노 row is **removed** from the cart table
- If cart is now empty: `"장바구니가 비어 있습니다."` message appears
- `localStorage["cart"]` = `[]`

| Actual Result | Pass/Fail | Evidence |
|---|---|---|
| | | `CTC-006-evidence.png` |

---

### CTC-007 — getCartTotal returns sum of all item subtotals ✅

| Item | Detail |
|---|---|
| **Test Item** | Verify `getCartTotal()` = sum of all `subtotal` values in cart |
| **Precondition** | Cart has: 아메리카노(₩3,000×1) and 카페라떼(₩3,500×2). |

**Test Procedure:**
1. Set `localStorage["cart"]` using DevTools Console:
```javascript
localStorage.setItem('cart', JSON.stringify([
  { menuItemId: 1, menuItemName: '아메리카노', price: 3000, quantity: 1, subtotal: 3000 },
  { menuItemId: 2, menuItemName: '카페라떼', price: 3500, quantity: 2, subtotal: 7000 }
])); location.reload();
```
2. Navigate to `http://localhost:5173/cart`
3. Observe the footer `"총액"` value
4. Observe the `"주문하기"` button text

**Expected Result:**
- Footer `"총액"` = **`"10,000원"`** (3000 + 7000)
- Button text: `"주문하기 (₩10,000)"`

| Actual Result | Pass/Fail | Evidence |
|---|---|---|
| | | `CTC-007-evidence.png` |

---

### CTC-008 — getCartCount returns total quantity across all items ✅

| Item | Detail |
|---|---|
| **Test Item** | Verify `getCartCount()` = sum of all `quantity` values |
| **Precondition** | Cart has: 아메리카노(qty=1) and 카페라떼(qty=2) → total = 3. |

**Test Procedure:**
1. Use same cart state as CTC-007
2. Observe the cart item count indicator in the Navbar (if present)

**Expected Result:**
- Cart count = **3** (1 + 2)

| Actual Result | Pass/Fail | Evidence |
|---|---|---|
| | | `CTC-008-evidence.png` |

---

### CTC-009 — Cart state persists after full page reload (F5) ✅

| Item | Detail |
|---|---|
| **Test Item** | Verify `CartProvider` restores cart from `localStorage` on mount |
| **Precondition** | Cart has 아메리카노 qty=1 in `localStorage`. |

**Test Procedure:**
1. Ensure cart has items (from any prior test or seed via Console)
2. Press **F5** to reload the page
3. Navigate to `http://localhost:5173/cart`
4. Observe the cart table

**Expected Result:**
- 아메리카노 row is still present with qty=1
- `"총액"` still shows `"3,000원"`
- Cart was rehydrated from `localStorage` without any manual action

| Actual Result | Pass/Fail | Evidence |
|---|---|---|
| | | `CTC-009-evidence.png` |

---

### CTC-010 — clearCart empties cart and updates localStorage ✅

| Item | Detail |
|---|---|
| **Test Item** | Verify `clearCart()` sets cart state to `[]` and updates `localStorage["cart"]` |
| **Precondition** | Cart has at least 1 item. This is triggered by a successful checkout (tested via CRT-009). |

**Test Procedure:**
1. Ensure cart has items
2. Navigate to `/cart` and complete a successful checkout
3. Inspect `localStorage["cart"]` in DevTools immediately after redirect

**Expected Result:**
- `localStorage["cart"]` = `"[]"` (empty JSON array string)
- Cart table shows no items on next visit to `/cart`

| Actual Result | Pass/Fail | Evidence |
|---|---|---|
| | | `CTC-010-evidence.png` |

---

## 8. Cart Page — Test Cases

**Component:** `CartPage`, `Cart`, `CartItem` | **Route:** `/cart`

---

### CRT-001 — Empty cart shows warning message ✅

| Item | Detail |
|---|---|
| **Test Item** | Verify the empty cart warning and navigation link are shown when cart has no items |
| **Precondition** | `localStorage["cart"]` is empty (`[]`) or cleared. |

**Test Procedure:**
1. Clear `localStorage` via DevTools and reload
2. Navigate to `http://localhost:5173/cart`
3. Observe the page content

**Expected Result:**
- Text `"장바구니가 비어 있습니다."` is displayed in a Bootstrap warning alert
- A link with text `"메뉴로 이동"` is visible inside the alert
- Cart items table (`<table>`) is **not** rendered

| Actual Result | Pass/Fail | Evidence |
|---|---|---|
| | | `CRT-001-evidence.png` |

---

### CRT-002 — "메뉴로 이동" link navigates to `/menu` ✅

| Item | Detail |
|---|---|
| **Test Item** | Verify the link in the empty cart warning navigates correctly |
| **Precondition** | CRT-001 completed. Empty cart page displayed. |

**Test Procedure:**
1. Click the `"메뉴로 이동"` link in the warning alert
2. Observe the URL and page content

**Expected Result:**
- URL changes to `http://localhost:5173/menu`
- MenuList page renders with category tabs and menu items

| Actual Result | Pass/Fail | Evidence |
|---|---|---|
| | | `CRT-002-evidence.png` |

---

### CRT-003 — Cart table renders with correct columns ✅

| Item | Detail |
|---|---|
| **Test Item** | Verify the cart table shows all 5 required column headers |
| **Precondition** | Cart has at least 1 item (seed via DevTools Console if needed). |

**Test Procedure:**
1. Seed cart: `localStorage.setItem('cart', JSON.stringify([{ menuItemId: 1, menuItemName: '아메리카노', price: 3000, quantity: 1, subtotal: 3000 }]))`
2. Reload and navigate to `http://localhost:5173/cart`
3. Observe the table header row

**Expected Result:**
- Table header row contains exactly these 5 columns (left to right): `메뉴` | `가격` | `수량` | `소계` | `삭제`

| Actual Result | Pass/Fail | Evidence |
|---|---|---|
| | | `CRT-003-evidence.png` |

---

### CRT-004 — Cart row displays correct values for each item ✅

| Item | Detail |
|---|---|
| **Test Item** | Verify each CartItem row shows correct name, price, quantity input, subtotal, and delete button |
| **Precondition** | Cart has 아메리카노 (price=3000, qty=1, subtotal=3000). On `/cart`. |

**Test Procedure:**
1. Inspect the first data row in the cart table
2. Verify each cell value

**Expected Result:**
- `메뉴` cell: `"아메리카노"`
- `가격` cell: `"3,000원"`
- `수량` cell: an `<input type="number">` with value `1`, min=`1`, max=`99`
- `소계` cell: `"3,000원"`
- `삭제` cell: a red button with text `"삭제"`

| Actual Result | Pass/Fail | Evidence |
|---|---|---|
| | | `CRT-004-evidence.png` |

---

### CRT-005 — Cart footer shows correct total ✅

| Item | Detail |
|---|---|
| **Test Item** | Verify the `<tfoot>` row shows the sum of all subtotals |
| **Precondition** | Cart has: 아메리카노(₩3,000×1) and 카페라떼(₩3,500×2). |

**Test Procedure:**
1. Seed cart with 2 items (see Section 3.2 Two item cart data)
2. Reload and navigate to `/cart`
3. Observe the last row of the table (footer)

**Expected Result:**
- Footer shows label `"총액:"` aligned right
- Total value: **`"10,000원"`** displayed in blue (`text-primary`) large (`fs-5`) bold text

| Actual Result | Pass/Fail | Evidence |
|---|---|---|
| | | `CRT-005-evidence.png` |

---

### CRT-006 — Checkout button label includes current total ✅

| Item | Detail |
|---|---|
| **Test Item** | Verify the checkout button text displays the current `getCartTotal()` value |
| **Precondition** | Cart has items with total = ₩10,000. On `/cart`. |

**Test Procedure:**
1. Use same cart state as CRT-005
2. Navigate to `/cart`
3. Locate the `"주문하기"` button
4. Read the button label text exactly

**Expected Result:**
- Button text: `"주문하기 (₩10,000)"`
- Button has class `btn-primary`

| Actual Result | Pass/Fail | Evidence |
|---|---|---|
| | | `CRT-006-evidence.png` |

---

### CRT-007 — Clicking "주문하기" shows confirm dialog ✅

| Item | Detail |
|---|---|
| **Test Item** | Verify `window.confirm("주문을 진행하시겠습니까?")` dialog appears on button click |
| **Precondition** | Cart has items. On `/cart`. |

**Test Procedure:**
1. Navigate to `/cart` with items in cart
2. Click the `"주문하기"` button
3. Observe immediately

**Expected Result:**
- Browser native confirm dialog appears
- Dialog message text: `"주문을 진행하시겠습니까?"`

| Actual Result | Pass/Fail | Evidence |
|---|---|---|
| | | `CRT-007-evidence.png` |

---

### CRT-008 — Cancelling the confirm dialog does not place order ✅

| Item | Detail |
|---|---|
| **Test Item** | Verify clicking "Cancel" on the confirm dialog aborts checkout |
| **Precondition** | Confirm dialog is visible (from CRT-007). |

**Test Procedure:**
1. When the confirm dialog appears, click **Cancel**
2. Observe the page
3. Observe the cart state via DevTools

**Expected Result:**
- Stays on `/cart` page (URL unchanged)
- Cart items are unchanged
- No network request made to `/order/checkout`

| Actual Result | Pass/Fail | Evidence |
|---|---|---|
| | | `CRT-008-evidence.png` |

---

### CRT-009 — Button shows loading spinner during checkout request ✅

| Item | Detail |
|---|---|
| **Test Item** | Verify `loading=true` state shows spinner + `"처리 중..."` text and disables button |
| **Precondition** | Backend running. Cart has items. Network throttled to **Slow 3G** to make spinner visible. |

**Test Procedure:**
1. Set DevTools Network to **Slow 3G**
2. Click `"주문하기"`, then click **OK** on confirm dialog
3. Immediately observe the button state before response arrives

**Expected Result:**
- Button shows Bootstrap spinner (`spinner-border-sm`) + text `"처리 중..."`
- Button `disabled` attribute is set (cannot be clicked again)

| Actual Result | Pass/Fail | Evidence |
|---|---|---|
| | | `CRT-009-evidence.png` |

---

### CRT-010 — Successful checkout plays animation then navigates to `/order-complete` ✅

| Item | Detail |
|---|---|
| **Test Item** | Verify animation fires, cart clears, then page navigates to `/order-complete` |
| **Precondition** | Backend running. Cart has 아메리카노 qty=1. |

**Test Procedure:**
1. Remove Slow 3G throttle
2. Click `"주문하기"` → click **OK**
3. Observe the screen immediately after API success
4. Wait approximately 1.1 seconds
5. Observe page after 1.1 seconds

**Expected Result:**
- Step 3: `OrderSuccessAnimation` component renders briefly (~1100ms)
- Step 5: URL changes to `http://localhost:5173/order-complete`
- `localStorage["cart"]` = `"[]"` (cleared)
- Order complete page displays

| Actual Result | Pass/Fail | Evidence |
|---|---|---|
| | | `CRT-010-evidence.png` |

---

### CRT-011 — Failed checkout shows alert and stays on cart page ❌

| Item | Detail |
|---|---|
| **Test Item** | Verify error handling when `/order/checkout` API call fails |
| **Precondition** | Cart has items. Backend is **stopped** or returns an error. |

**Test Procedure:**
1. Stop the backend server
2. Navigate to `/cart` with items
3. Click `"주문하기"` → **OK**
4. Observe the result

**Expected Result:**
- Browser `alert()` dialog shows: `"주문 처리 중 오류가 발생했습니다. 다시 시도해주세요."`
- After dismissing alert: stays on `/cart` page
- Cart items are **not** cleared
- No navigation to `/order-complete`

| Actual Result | Pass/Fail | Evidence |
|---|---|---|
| | | `CRT-011-evidence.png` |

---

## 9. Order Complete Page — Test Cases

**Component:** `OrderCompletePage`, `OrderComplete` | **Route:** `/order-complete`

---

### ORD-001 — Page renders with success icon and heading ✅

| Item | Detail |
|---|---|
| **Test Item** | Verify the success SVG checkmark and main heading are displayed |
| **Precondition** | Arrived at `/order-complete` via successful checkout (CRT-010 completed). |

**Test Procedure:**
1. After successful checkout, observe the `/order-complete` page
2. Locate the icon at the top of the page
3. Locate the main heading text

**Expected Result:**
- A green circular checkmark SVG icon is displayed (Bootstrap `bi-check-circle`, color `text-success`)
- Heading text: `"주문이 완료되었습니다!"`

| Actual Result | Pass/Fail | Evidence |
|---|---|---|
| | | `ORD-001-evidence.png` |

---

### ORD-002 — Order number displayed in info alert box ✅

| Item | Detail |
|---|---|
| **Test Item** | Verify `order.orderNumber` is displayed in a Bootstrap info alert |
| **Precondition** | On `/order-complete` from CRT-010. |

**Test Procedure:**
1. Observe the alert box below the main heading
2. Read the text inside the alert

**Expected Result:**
- A Bootstrap `alert-info` box contains: `"주문번호: ORD-20260303-XXXX"`
- Order number matches the format `ORD-YYYYMMDD-\d{4}`

| Actual Result | Pass/Fail | Evidence |
|---|---|---|
| | | `ORD-002-evidence.png` |

---

### ORD-003 — Customer name is displayed ✅

| Item | Detail |
|---|---|
| **Test Item** | Verify `order.customerName` is shown in the order detail card |
| **Precondition** | Order was placed with `customerName: "Guest"` (default in CartPage). |

**Test Procedure:**
1. In the `"주문 상세"` card, locate the customer name row

**Expected Result:**
- Row shows: `"주문자: Guest"`

| Actual Result | Pass/Fail | Evidence |
|---|---|---|
| | | `ORD-003-evidence.png` |

---

### ORD-004 — Order time is formatted in Korean locale ✅

| Item | Detail |
|---|---|
| **Test Item** | Verify `order.orderedAt` is displayed in Korean date/time format |
| **Precondition** | On `/order-complete` page. |

**Test Procedure:**
1. In the `"주문 상세"` card, locate the order time row

**Expected Result:**
- Row label: `"주문 시간:"`
- Date format matches Korean locale: e.g., `"2026. 03. 03. 오후 2:30"` (via `toLocaleString("ko-KR")`)

| Actual Result | Pass/Fail | Evidence |
|---|---|---|
| | | `ORD-004-evidence.png` |

---

### ORD-005 — Order status is displayed ✅

| Item | Detail |
|---|---|
| **Test Item** | Verify `order.status` is shown in the detail card |
| **Precondition** | On `/order-complete` page. |

**Test Procedure:**
1. Locate the `"상태:"` row in the `"주문 상세"` card

**Expected Result:**
- Row shows: `"상태: PENDING"` (or styled equivalent)

| Actual Result | Pass/Fail | Evidence |
|---|---|---|
| | | `ORD-005-evidence.png` |

---

### ORD-006 — All ordered items are listed with correct values ✅

| Item | Detail |
|---|---|
| **Test Item** | Verify `order.items` renders each item's name, quantity, price, subtotal |
| **Precondition** | Order was placed for 아메리카노 qty=1 (₩3,000). |

**Test Procedure:**
1. In the `"주문 상세"` card, locate the items section
2. Find the row for `"아메리카노"`

**Expected Result:**
- Item name: `"아메리카노"` visible
- Quantity: `1` visible
- Price: `"3,000원"` visible
- Subtotal: `"3,000원"` visible

| Actual Result | Pass/Fail | Evidence |
|---|---|---|
| | | `ORD-006-evidence.png` |

---

### ORD-007 — Total amount is displayed in Korean format ✅

| Item | Detail |
|---|---|
| **Test Item** | Verify `order.totalAmount` is formatted as Korean number string |
| **Precondition** | Order total = 3000. On `/order-complete`. |

**Test Procedure:**
1. Locate the total amount in the `"주문 상세"` card

**Expected Result:**
- Total displays as `"3,000원"` (comma-separated, `원` suffix)

| Actual Result | Pass/Fail | Evidence |
|---|---|---|
| | | `ORD-007-evidence.png` |

---

### ORD-008 — Direct URL access to `/order-complete` redirects to `/` ❌

| Item | Detail |
|---|---|
| **Test Item** | Verify guard logic: `if (!order) return <Navigate to="/" replace />` |
| **Precondition** | No recent checkout. No `location.state` available. |

**Test Procedure:**
1. Open a fresh browser tab
2. Type `http://localhost:5173/order-complete` in the address bar and press Enter
3. Observe the result

**Expected Result:**
- Browser immediately redirects to `http://localhost:5173/`
- Home page content is shown
- No order-complete content shown even briefly

| Actual Result | Pass/Fail | Evidence |
|---|---|---|
| | | `ORD-008-evidence.png` |

---

## 10. Navbar — Test Cases

**Component:** `Navbar`

---

### NAV-001 — Navbar is visible on all routes ✅

| Item | Detail |
|---|---|
| **Test Item** | Verify `Navbar` renders consistently across all defined routes |
| **Precondition** | Frontend running. |

**Test Procedure:**
1. Navigate to `/` — observe Navbar
2. Navigate to `/menu` — observe Navbar
3. Navigate to `/cart` — observe Navbar

**Expected Result:**
- Navbar is visible at the top of the page on all 3 routes
- Navbar does not disappear or collapse during navigation

| Actual Result | Pass/Fail | Evidence |
|---|---|---|
| | | `NAV-001-evidence.png` |

---

### NAV-002 — Navbar links navigate to correct routes ✅

| Item | Detail |
|---|---|
| **Test Item** | Verify each Navbar link leads to the correct route |
| **Precondition** | Frontend running. On any page. |

**Test Procedure:**
1. Click the Navbar home/logo link → observe URL
2. Click the `"메뉴"` (or menu) Navbar link → observe URL
3. Click the `"장바구니"` (or cart) Navbar link → observe URL

**Expected Result:**
- Step 1: URL = `http://localhost:5173/`
- Step 2: URL = `http://localhost:5173/menu`
- Step 3: URL = `http://localhost:5173/cart`

| Actual Result | Pass/Fail | Evidence |
|---|---|---|
| | | `NAV-002-evidence.png` |

---

## 11. LocalStorage Persistence — Test Cases

---

### LST-001 — Cart survives full page reload ✅

| Item | Detail |
|---|---|
| **Test Item** | Verify `CartProvider` reads `localStorage["cart"]` on mount and restores state |
| **Precondition** | Cart has 아메리카노 qty=1 in `localStorage`. |

**Test Procedure:**
1. Ensure `localStorage["cart"]` has items (via prior test or Console seed)
2. Press **F5** to do a hard reload
3. Navigate to `/cart`
4. Observe cart table

**Expected Result:**
- 아메리카노 row present with qty=1
- Total shows `"3,000원"`
- No items lost from reload

| Actual Result | Pass/Fail | Evidence |
|---|---|---|
| | | `LST-001-evidence.png` |

---

### LST-002 — localStorage is updated in real-time on cart changes ✅

| Item | Detail |
|---|---|
| **Test Item** | Verify `useEffect` writes to `localStorage` after every cart state change |
| **Precondition** | DevTools open on Application → Local Storage. Cart has 아메리카노 qty=1. |

**Test Procedure:**
1. Open DevTools → Application → Local Storage → `http://localhost:5173`
2. Note `cart` value (should show qty=1)
3. Navigate to `/menu`
4. Click the `"카페라떼"` card to add it
5. Immediately switch back to DevTools → Local Storage and refresh the view

**Expected Result:**
- `localStorage["cart"]` now contains **2 items** (아메리카노 + 카페라떼)
- Updated **without any reload**

| Actual Result | Pass/Fail | Evidence |
|---|---|---|
| | | `LST-002-evidence.png` |

---

### LST-003 — localStorage cleared after successful checkout ✅

| Item | Detail |
|---|---|
| **Test Item** | Verify `clearCart()` sets `localStorage["cart"]` to `"[]"` after order |
| **Precondition** | Cart has items. Backend running. |

**Test Procedure:**
1. Place a successful order (complete checkout flow)
2. Immediately after redirect to `/order-complete`, open DevTools → Application → Local Storage

**Expected Result:**
- `localStorage["cart"]` value = `"[]"`

| Actual Result | Pass/Fail | Evidence |
|---|---|---|
| | | `LST-003-evidence.png` |

---

### LST-004 — Corrupted localStorage cart value does not crash the app ❌

| Item | Detail |
|---|---|
| **Test Item** | Verify `CartProvider` handles invalid JSON in `localStorage["cart"]` gracefully |
| **Precondition** | Frontend running. |

**Test Procedure:**
1. In DevTools Console, run: `localStorage.setItem('cart', 'INVALID_JSON{{{');`
2. Press **F5** to reload
3. Navigate to `/cart`
4. Observe Console for errors and page for content

**Expected Result:**
- Page does **not** crash with a blank white screen
- No uncaught exception in DevTools Console
- Cart defaults to empty state: `"장바구니가 비어 있습니다."` displayed

| Actual Result | Pass/Fail | Evidence |
|---|---|---|
| | | `LST-004-evidence.png` |

---

## 12. Price Formatting — Test Cases

---

### FMT-001 — MenuCard displays price with ₩ prefix in Korean number format ✅

| Item | Detail |
|---|---|
| **Test Item** | Verify `₩{price.toLocaleString()}` renders correctly on menu cards |
| **Precondition** | `/menu` loaded. |

**Test Procedure:**
1. Navigate to `/menu`
2. Locate the 아메리카노 card (price = 3000)
3. Read the price text exactly

**Expected Result:**
- Price text: `"₩3,000"` (₩ prefix + comma at thousands)

| Actual Result | Pass/Fail | Evidence |
|---|---|---|
| | | `FMT-001-evidence.png` |

---

### FMT-002 — CartItem displays price and subtotal with 원 suffix ✅

| Item | Detail |
|---|---|
| **Test Item** | Verify `formatPrice()` + `"원"` suffix in Cart table cells |
| **Precondition** | Cart has 아메리카노 qty=2 (subtotal=6000). On `/cart`. |

**Test Procedure:**
1. Navigate to `/cart` with 아메리카노 qty=2
2. Read the `"가격"` cell text
3. Read the `"소계"` cell text

**Expected Result:**
- `"가격"` cell: `"3,000원"`
- `"소계"` cell: `"6,000원"`

| Actual Result | Pass/Fail | Evidence |
|---|---|---|
| | | `FMT-002-evidence.png` |

---

### FMT-003 — Checkout button total uses ₩ prefix and no 원 suffix ✅

| Item | Detail |
|---|---|
| **Test Item** | Verify checkout button format: `"주문하기 (₩{total})"` |
| **Precondition** | Cart total = 10000. On `/cart`. |

**Test Procedure:**
1. Navigate to `/cart` with total = ₩10,000
2. Read the `"주문하기"` button text exactly

**Expected Result:**
- Button text: `"주문하기 (₩10,000)"`
- Note: ₩ prefix used here, not `원` suffix

| Actual Result | Pass/Fail | Evidence |
|---|---|---|
| | | `FMT-003-evidence.png` |

---

### FMT-004 — Cart total of 0 renders as ₩0 on empty cart button ✅

| Item | Detail |
|---|---|
| **Test Item** | Verify zero total is handled correctly in button label |
| **Precondition** | Cart is empty. On `/cart`. |

**Test Procedure:**
1. Clear cart and navigate to `/cart`
2. Read the `"주문하기"` button text

**Expected Result:**
- Button text: `"주문하기 (₩0)"`

| Actual Result | Pass/Fail | Evidence |
|---|---|---|
| | | `FMT-004-evidence.png` |

---

## 13. Responsive Layout — Test Cases

---

### RES-001 — Menu grid uses auto-fill columns at 1280×800 ✅

| Item | Detail |
|---|---|
| **Test Item** | Verify `MenuGrid` renders multiple columns at desktop resolution |
| **Precondition** | Chrome window at 1280×800. Menu loaded. |

**Test Procedure:**
1. Set Chrome window to 1280px wide
2. Navigate to `/menu`
3. Right-click a menu card → Inspect
4. Observe computed CSS `grid-template-columns` of the `MenuGrid` container

**Expected Result:**
- Multiple columns rendered (auto-fill, minwidth 200px)
- At least 4 cards per row visible

| Actual Result | Pass/Fail | Evidence |
|---|---|---|
| | | `RES-001-evidence.png` |

---

### RES-002 — Menu grid adapts at 768px width (tablet) ✅

| Item | Detail |
|---|---|
| **Test Item** | Verify CSS media query at `max-width: 768px` reduces min column width to 160px |
| **Precondition** | DevTools → Device Toolbar → set to 768px width. |

**Test Procedure:**
1. Open DevTools → Toggle Device Toolbar (Ctrl+Shift+M)
2. Set width to `768`
3. Navigate to `/menu`
4. Inspect `MenuGrid` computed styles

**Expected Result:**
- `grid-template-columns` uses `minmax(160px, 1fr)` (smaller than desktop 200px)
- Gap between cards = `16px` (reduced from desktop `24px`)

| Actual Result | Pass/Fail | Evidence |
|---|---|---|
| | | `RES-002-evidence.png` |

---

### RES-003 — No horizontal scroll on mobile width (375px) ✅

| Item | Detail |
|---|---|
| **Test Item** | Verify no horizontal overflow/scrollbar at 375px viewport width |
| **Precondition** | DevTools Device Toolbar set to 375px (iPhone SE). |

**Test Procedure:**
1. Set DevTools device width to `375`
2. Navigate to `/`, `/menu`, and `/cart` in sequence
3. Observe horizontal scrollbar presence on each page

**Expected Result:**
- No horizontal scrollbar on any of the 3 pages
- All content fits within the 375px viewport

| Actual Result | Pass/Fail | Evidence |
|---|---|---|
| | | `RES-003-evidence.png` |

---

## 14. Test Execution Order (Recommended)

```
1.  RTE-001 → RTE-005          (Basic routing — no prior state needed)
2.  HOM-001 → HOM-002          (Home page)
3.  MNU-001 → MNU-005          (Menu loading, layout — no cart dependency)
4.  MNU-006 → MNU-007          (Category filtering)
5.  MNU-008 → MNU-011          (Add to cart, toast, hover)
6.  CTC-001 → CTC-003          (CartContext add — builds up cart)
7.  CTC-004                    (CartContext remove — use cart from CTC-003)
8.  CTC-005 → CTC-006          (CartContext update quantity — navigate to /cart)
9.  CTC-007 → CTC-009          (Totals, count, persistence)
10. CRT-001 → CRT-002          (Empty cart UI — clear first)
11. CRT-003 → CRT-006          (Cart table with items)
12. CRT-007 → CRT-011          (Checkout flow — normal then error)
13. CTC-010                    (Verify clearCart after CRT-010 success)
14. ORD-001 → ORD-008          (Order complete page)
15. NAV-001 → NAV-002          (Navbar)
16. LST-001 → LST-004          (localStorage)
17. FMT-001 → FMT-004          (Price formatting)
18. RES-001 → RES-003          (Responsive — use DevTools device toolbar)
```

---

## 15. Test Results Summary

| Section | Case IDs | Total | Passed | Failed | Not Tested |
|---|---|---|---|---|---|
| Routing | RTE-001 ~ RTE-005 | 5 | | | |
| Home Page | HOM-001 ~ HOM-002 | 2 | | | |
| Menu — Loading & Layout | MNU-001 ~ MNU-005 | 5 | | | |
| Menu — Category Filter | MNU-006 ~ MNU-007 | 2 | | | |
| Menu — Add to Cart | MNU-008 ~ MNU-011 | 4 | | | |
| CartContext | CTC-001 ~ CTC-010 | 10 | | | |
| Cart Page — Empty | CRT-001 ~ CRT-002 | 2 | | | |
| Cart Page — Items & Table | CRT-003 ~ CRT-006 | 4 | | | |
| Cart Page — Checkout | CRT-007 ~ CRT-011 | 5 | | | |
| Order Complete | ORD-001 ~ ORD-008 | 8 | | | |
| Navbar | NAV-001 ~ NAV-002 | 2 | | | |
| LocalStorage | LST-001 ~ LST-004 | 4 | | | |
| Price Formatting | FMT-001 ~ FMT-004 | 4 | | | |
| Responsive Layout | RES-001 ~ RES-003 | 3 | | | |
| **Total** | | **60** | | | |

---

## 16. Defect Log

| Defect No. | Test Case | Severity | Description | Steps to Reproduce | Status | Assignee | Reported Date |
|---|---|---|---|---|---|---|---|
| — | — | — | — | — | — | — | — |

> Severity: **Critical** (crash/unusable) / **Major** (core function broken) / **Minor** (cosmetic) / **Trivial**

---

## 17. Evidence File Naming Convention

All screenshot evidence should be saved as:  
`<TestCaseID>-evidence.png`  
Example: `CRT-010-evidence.png`

Store in: `docs/test-evidence/frontend/`

---

## 18. Sign-off

| Role | Name | Signature | Date |
|---|---|---|---|
| Test Lead | | | |
| Developer | | | |
| Reviewer | | | |

