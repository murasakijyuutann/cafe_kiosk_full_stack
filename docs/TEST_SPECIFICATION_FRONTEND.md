# Frontend Test Specification
## Cafe Kiosk System — React UI

| Item | Detail |
|---|---|
| Document No. | TS-FRONTEND-001 |
| Version | 1.0 |
| Created | 2026-03-03 |
| Author | MKSS Team |
| Status | Draft |
| Target System | React + TypeScript + Vite (frontend) |
| Base URL | `http://localhost:5173` |

---

## 1. Scope

This document covers functional test cases for all pages, components, and state management in the Cafe Kiosk frontend application.  
Testing phases covered: **Manual UI Test (UT)** and **Integration Test (IT)** with backend.

### 1.1 Pages & Components Under Test

| Route | Component | Description |
|---|---|---|
| `/` | `Home` | Landing page with cafe image |
| `/menu` | `MenuList` | Menu display with category filtering |
| `/menu?category={name}` | `MenuList` | Filtered menu by category |
| `/cart` | `CartPage` + `Cart` + `CartItem` | Cart review and checkout |
| `/order-complete` | `OrderCompletePage` + `OrderComplete` | Order confirmation display |
| — | `CartContext` | Global cart state (add, remove, update, clear, total) |
| — | `Navbar` | Navigation bar |

### 1.2 Test Type Legend

| Symbol | Meaning |
|---|---|
| ✅ Normal | Normal / happy path |
| ❌ Abnormal | Error / edge / boundary case |

### 1.3 Pass/Fail Criteria

- **PASS** — UI renders correctly and behaves exactly as specified
- **FAIL** — Any visual defect, incorrect state, wrong navigation, or missing element

---

## 2. Test Environment

| Item | Value |
|---|---|
| Framework | React 18 + TypeScript + Vite |
| Routing | React Router v6 |
| State | React Context API (`CartContext`) |
| Persistence | `localStorage` (cart data) |
| Styling | styled-components + Bootstrap |
| Browser | Chrome (latest) |
| Resolution | 1280×800 (desktop), 768×1024 (tablet) |
| Backend | Spring Boot running on `http://localhost:8080` |

---

## 3. Routing Test Cases

| No. | Type | Precondition | Operation | Expected Result | Actual Result | Pass/Fail | Notes |
|---|---|---|---|---|---|---|---|
| RTE-001 | ✅ Normal | App loaded | Navigate to `/` | Home page renders; cafe image is displayed | | | |
| RTE-002 | ✅ Normal | App loaded | Navigate to `/menu` | MenuList page renders; loading spinner shown, then menu items appear | | | |
| RTE-003 | ✅ Normal | App loaded | Navigate to `/cart` | CartPage renders; either cart items or empty cart message shown | | | |
| RTE-004 | ❌ Abnormal | No order state in location | Navigate directly to `/order-complete` (no state) | Redirected to `/` immediately | | | `<Navigate to="/" replace>` |
| RTE-005 | ✅ Normal | App loaded | Navigate to `/menu?category=커피` | MenuList shows only 커피 category items; 커피 tab is highlighted | | | |
| RTE-006 | ❌ Abnormal | App loaded | Navigate to `/unknown-route` | 404 or fallback behavior — document actual result | | | No catch-all route defined |

---

## 4. Home Page Test Cases

**Component:** `Home`  
**Route:** `/`

| No. | Type | Precondition | Operation | Expected Result | Actual Result | Pass/Fail | Notes |
|---|---|---|---|---|---|---|---|
| HOM-001 | ✅ Normal | App loaded | Navigate to `/` | Full-width cafe image renders (80vh height) | | | |
| HOM-002 | ✅ Normal | App loaded | Observe image URL | Image loads from S3 URL: `cafe2.jpg` | | | Requires internet / S3 access |
| HOM-003 | ❌ Abnormal | S3 unreachable / no internet | Navigate to `/` | Broken image icon shown (no crash) | | | Graceful degradation |

---

## 5. Menu Page Test Cases

**Component:** `MenuList`  
**Route:** `/menu`

### 5.1 Menu Loading

| No. | Type | Precondition | Operation | Expected Result | Actual Result | Pass/Fail | Notes |
|---|---|---|---|---|---|---|---|
| MNU-001 | ✅ Normal | Backend running; menu items exist | Navigate to `/menu` | "Loading menu..." shown briefly, then menu items render | | | |
| MNU-002 | ✅ Normal | Menu loaded | Observe page | Category tab bar is visible (전체 + category names) | | | |
| MNU-003 | ✅ Normal | Menu loaded (3 categories) | Observe page | 전체 tab shows all items grouped under category headers | | | |
| MNU-004 | ✅ Normal | Menu loaded | Observe each menu card | Each card shows: image, item name, price (₩ format), `+` badge | | | |
| MNU-005 | ❌ Abnormal | Backend is down | Navigate to `/menu` | "Failed to load menu items." error message shown; no crash | | | |

### 5.2 Category Filtering

| No. | Type | Precondition | Operation | Expected Result | Actual Result | Pass/Fail | Notes |
|---|---|---|---|---|---|---|---|
| MNU-006 | ✅ Normal | Menu loaded; 전체 tab selected | Click category tab "커피" | URL changes to `/menu?category=커피`; only 커피 items shown; 커피 tab highlighted | | | |
| MNU-007 | ✅ Normal | Category tab "커피" selected | Click "전체" tab | URL changes to `/menu`; all items shown grouped by category; 전체 tab highlighted | | | |
| MNU-008 | ✅ Normal | Category tab selected | Switch between tabs | Active tab has green background (`#2d6a4f`); inactive tabs are white | | | |
| MNU-009 | ✅ Normal | Menu with multiple categories | Observe 전체 view | Each category has a `CategoryTitle` heading with left green border | | | |
| MNU-010 | ❌ Abnormal | Menu loaded | Navigate to `/menu?category=InvalidCategory` | No items shown; tab bar present; no crash | | | Empty filter result |

### 5.3 Add to Cart from Menu

| No. | Type | Precondition | Operation | Expected Result | Actual Result | Pass/Fail | Notes |
|---|---|---|---|---|---|---|---|
| MNU-011 | ✅ Normal | Menu loaded; cart empty | Click a menu card (e.g., 아메리카노) | Item added to cart (CartContext); toast notification appears bottom-right | | | |
| MNU-012 | ✅ Normal | Item added (MNU-011) | Observe toast | Toast text: `"아메리카노이(가) 장바구니에 추가되었습니다"` with ✓ prefix | | | |
| MNU-013 | ✅ Normal | Toast shown (MNU-012) | Wait 2 seconds | Toast disappears automatically after 2000ms | | | Auto-dismiss |
| MNU-014 | ✅ Normal | Menu card hovered | Hover mouse over card | Card lifts up (`translateY(-8px)`); shadow increases; `+` badge enlarges | | | CSS transition |
| MNU-015 | ✅ Normal | Same item added twice | Click same card twice | Cart quantity = 2; subtotal = price × 2 | | | Quantity accumulation |

---

## 6. Cart Context Test Cases

**Component:** `CartContext` / `CartProvider`  
**Note:** Test via UI interactions; verify state via CartPage or browser localStorage.

### 6.1 addToCart

| No. | Type | Precondition | Operation | Expected Result | Actual Result | Pass/Fail | Notes |
|---|---|---|---|---|---|---|---|
| CTC-001 | ✅ Normal | Empty cart | Add item A (price=3000, qty=1) | Cart has 1 item; subtotal=3000; localStorage updated | | | |
| CTC-002 | ✅ Normal | Item A already in cart (qty=1) | Add item A again (qty=1) | Cart still has 1 entry; quantity=2; subtotal=6000 | | | Accumulation |
| CTC-003 | ✅ Normal | Empty cart | Add item A (qty=1), then item B (qty=1) | Cart has 2 distinct entries | | | |
| CTC-004 | ✅ Normal | Item added | Check `localStorage` key `"cart"` | JSON array stored correctly with all fields | | | Persistence |

### 6.2 removeFromCart

| No. | Type | Precondition | Operation | Expected Result | Actual Result | Pass/Fail | Notes |
|---|---|---|---|---|---|---|---|
| CTC-005 | ✅ Normal | Cart has item A and B | Remove item A | Cart has only item B remaining | | | |
| CTC-006 | ✅ Normal | Item removed | Check `localStorage` | localStorage updated to reflect removal | | | |

### 6.3 updateQuantity

| No. | Type | Precondition | Operation | Expected Result | Actual Result | Pass/Fail | Notes |
|---|---|---|---|---|---|---|---|
| CTC-007 | ✅ Normal | Cart has item A (qty=1) | Update quantity to 3 | Item quantity=3; subtotal = price × 3 | | | |
| CTC-008 | ❌ Abnormal | Cart has item A (qty=2) | Update quantity to 0 | Item is REMOVED from cart (quantity ≤ 0 triggers removeFromCart) | | | Edge case |
| CTC-009 | ❌ Abnormal | Cart has item A | Update quantity to -1 | Item is REMOVED from cart | | | Negative quantity |

### 6.4 clearCart & totals

| No. | Type | Precondition | Operation | Expected Result | Actual Result | Pass/Fail | Notes |
|---|---|---|---|---|---|---|---|
| CTC-010 | ✅ Normal | Cart has 3 items | Call clearCart | Cart is empty; `[]` stored in localStorage | | | |
| CTC-011 | ✅ Normal | Cart: A(₩3000×1), B(₩3500×2) | Check `getCartTotal()` | Returns 10000 | | | Total = 3000 + 7000 |
| CTC-012 | ✅ Normal | Cart: A(qty=2), B(qty=3) | Check `getCartCount()` | Returns 5 | | | Sum of all quantities |
| CTC-013 | ✅ Normal | App reloaded (F5) | Observe cart state | Cart items restored from localStorage; state persists across reload | | | Hydration |

---

## 7. Cart Page Test Cases

**Component:** `CartPage` + `Cart` + `CartItem`  
**Route:** `/cart`

### 7.1 Empty Cart State

| No. | Type | Precondition | Operation | Expected Result | Actual Result | Pass/Fail | Notes |
|---|---|---|---|---|---|---|---|
| CRT-001 | ✅ Normal | Cart is empty | Navigate to `/cart` | "장바구니가 비어 있습니다." warning shown with link to `/menu` | | | |
| CRT-002 | ✅ Normal | Empty cart page | Observe checkout button | Button shows `주문하기 (₩0)` with total = 0 | | | |
| CRT-003 | ✅ Normal | Empty cart page | Click "메뉴로 이동" link | Navigate to `/menu` | | | |

### 7.2 Cart with Items

| No. | Type | Precondition | Operation | Expected Result | Actual Result | Pass/Fail | Notes |
|---|---|---|---|---|---|---|---|
| CRT-004 | ✅ Normal | Cart has 2 items | Navigate to `/cart` | Cart table shown with columns: 메뉴, 가격, 수량, 소계, 삭제 | | | |
| CRT-005 | ✅ Normal | Cart has items | Observe table footer | Total row shows sum of all subtotals formatted in Korean number style (e.g., 10,000원) | | | |
| CRT-006 | ✅ Normal | Cart has items | Change quantity input for item (e.g., 2→3) | Subtotal for that item updates; total in footer updates | | | |
| CRT-007 | ✅ Normal | Cart has items | Set quantity input to 0 | Item is removed from cart; table updates | | | updateQuantity(0) → remove |
| CRT-008 | ✅ Normal | Cart has 2 items | Click "삭제" button on item | That item is removed; remaining items still shown | | | |
| CRT-009 | ✅ Normal | Cart has items | Observe checkout button | Button shows `주문하기 (₩{total})` with current total | | | |

### 7.3 Checkout Flow

| No. | Type | Precondition | Operation | Expected Result | Actual Result | Pass/Fail | Notes |
|---|---|---|---|---|---|---|---|
| CRT-010 | ✅ Normal | Cart has items | Click "주문하기" button | `window.confirm("주문을 진행하시겠습니까?")` dialog appears | | | |
| CRT-011 | ✅ Normal | Confirm dialog shown | Click "Cancel" | Order is NOT placed; stays on `/cart`; cart unchanged | | | |
| CRT-012 | ✅ Normal | Confirm dialog shown; backend running | Click "OK" | Button shows spinner + "처리 중..."; disabled during request | | | Loading state |
| CRT-013 | ✅ Normal | Order success | After API success | `OrderSuccessAnimation` plays (~1100ms); then cart is cleared; navigate to `/order-complete` | | | |
| CRT-014 | ❌ Abnormal | Backend down or returns error | Click "OK" on confirm | Alert: "주문 처리 중 오류가 발생했습니다. 다시 시도해주세요."; stays on cart page | | | |
| CRT-015 | ✅ Normal | Order navigates to complete | Navigate to `/order-complete` | `OrderCompletePage` renders with correct order data from state | | | |

---

## 8. Order Complete Page Test Cases

**Component:** `OrderCompletePage` + `OrderComplete`  
**Route:** `/order-complete`

| No. | Type | Precondition | Operation | Expected Result | Actual Result | Pass/Fail | Notes |
|---|---|---|---|---|---|---|---|
| ORD-001 | ✅ Normal | Navigated from successful checkout | Observe page | Green checkmark SVG icon displayed; "주문이 완료되었습니다!" heading | | | |
| ORD-002 | ✅ Normal | Order complete page loaded | Observe order number | `orderNumber` displayed in info alert box (e.g., `주문번호: ORD-20260303-0001`) | | | |
| ORD-003 | ✅ Normal | Order has customerName | Observe customer name row | "주문자: Guest" (or provided name) shown | | | |
| ORD-004 | ✅ Normal | Order complete page | Observe ordered time | Date formatted in Korean locale: `YYYY. MM. DD. HH:MM` | | | |
| ORD-005 | ✅ Normal | Order has 2 items | Observe items table | All ordered items listed with name, qty, price, subtotal | | | |
| ORD-006 | ✅ Normal | Order complete page | Observe total | `totalAmount` formatted with Korean number format (e.g., `10,000원`) | | | |
| ORD-007 | ✅ Normal | Order complete page | Click "홈으로" or "메뉴로" button (if present) | Navigate to appropriate route | | | |
| ORD-008 | ❌ Abnormal | User directly opens `/order-complete` (no state) | Observe behavior | Immediately redirected to `/`; no crash | | | Guard in `OrderCompletePage` |

---

## 9. Navbar Test Cases

**Component:** `Navbar`

| No. | Type | Precondition | Operation | Expected Result | Actual Result | Pass/Fail | Notes |
|---|---|---|---|---|---|---|---|
| NAV-001 | ✅ Normal | Any page | Observe navbar | Navbar is visible at top on all routes | | | |
| NAV-002 | ✅ Normal | Any page | Click home/logo link | Navigate to `/` | | | |
| NAV-003 | ✅ Normal | Any page | Click menu link | Navigate to `/menu` | | | |
| NAV-004 | ✅ Normal | Any page | Click cart link | Navigate to `/cart` | | | |
| NAV-005 | ✅ Normal | Cart has 3 items | Observe cart icon/link in Navbar | Cart item count badge shows `3` (if badge is implemented) | | | Verify with `getCartCount()` |

---

## 10. Responsive Layout Test Cases

| No. | Type | Resolution | Page | Expected Result | Actual Result | Pass/Fail | Notes |
|---|---|---|---|---|---|---|---|
| RES-001 | ✅ Normal | 1280×800 | `/menu` | Menu grid shows multiple columns (auto-fill, min 200px) | | | |
| RES-002 | ✅ Normal | 768×1024 (tablet) | `/menu` | Menu grid adjusts to min 160px columns; smaller gap (16px) | | | CSS media query |
| RES-003 | ✅ Normal | 1280×800 | `/cart` | Cart table fully visible; no horizontal scroll | | | |
| RES-004 | ✅ Normal | 375×667 (mobile) | Any page | No content overflow; horizontal scroll absent | | | |

---

## 11. LocalStorage Persistence Test Cases

| No. | Type | Precondition | Operation | Expected Result | Actual Result | Pass/Fail | Notes |
|---|---|---|---|---|---|---|---|
| LST-001 | ✅ Normal | Cart has 2 items | Reload page (F5) | Cart items still present; same quantities | | | Restored from localStorage |
| LST-002 | ✅ Normal | Cart has items | Clear cart via checkout | `localStorage["cart"]` = `"[]"` | | | |
| LST-003 | ✅ Normal | Cart has items | Open new tab, navigate to `/cart` | Same cart items appear (same localStorage key) | | | Same origin |
| LST-004 | ❌ Abnormal | localStorage has corrupted `cart` value | Reload page | Page does not crash; cart gracefully defaults to `[]` | | | JSON.parse safety |

---

## 12. Price Formatting Test Cases

| No. | Type | Input | Expected Rendered Output | Actual Result | Pass/Fail | Notes |
|---|---|---|---|---|---|---|
| FMT-001 | ✅ Normal | price = 3000 | `3,000원` | | | Korean number format |
| FMT-002 | ✅ Normal | price = 10000 | `10,000원` | | | |
| FMT-003 | ✅ Normal | price = 3500.50 | `3,501원` or `3,500원` — document actual | | | Decimal handling |
| FMT-004 | ✅ Normal | price = 0 | `0원` | | | Zero case |
| FMT-005 | ✅ Normal | Menu card price display | `₩3,000` (with ₩ prefix) | | | MenuList uses `₩` prefix |

---

## 13. Test Results Summary

| Category | Total Cases | Passed | Failed | Not Tested |
|---|---|---|---|---|
| Routing | 6 | | | |
| Home Page | 3 | | | |
| Menu — Loading | 5 | | | |
| Menu — Category Filter | 5 | | | |
| Menu — Add to Cart | 5 | | | |
| CartContext | 13 | | | |
| Cart Page — Empty | 3 | | | |
| Cart Page — Items | 6 | | | |
| Cart Page — Checkout | 6 | | | |
| Order Complete | 8 | | | |
| Navbar | 5 | | | |
| Responsive Layout | 4 | | | |
| LocalStorage | 4 | | | |
| Price Formatting | 5 | | | |
| **Total** | **78** | | | |

---

## 14. Defect Log

| No. | Test Case | Severity | Description | Status | Assignee |
|---|---|---|---|---|---|
| — | — | — | — | — | — |

> Severity levels: **Critical** / **Major** / **Minor** / **Trivial**

---

## 15. Sign-off

| Role | Name | Signature | Date |
|---|---|---|---|
| Test Lead | | | |
| Developer | | | |
| Reviewer | | | |
