# Frontend-Backend Integration Fix Guide

## 🚨 Current Status: CRITICALLY DISCONNECTED

Your frontend and backend are **NOT properly connected**. They exist as separate systems using different APIs and cart management approaches.

## 📋 Summary of Issues

| Issue | Severity | Impact |
|-------|----------|--------|
| Endpoint path mismatches | 🔴 CRITICAL | Frontend cannot fetch menu items |
| Order creation broken | 🔴 CRITICAL | Cannot place orders |
| Cart architecture conflict | 🔴 CRITICAL | Two separate cart systems |
| Mock data still in use | 🟡 HIGH | Real backend not being called |
| No CORS configuration | 🟡 HIGH | Direct API calls fail |
| Category API mismatch | 🟠 MEDIUM | Category filtering broken |

---

## 🎯 Recommended Fix Strategy: Minimal Backend Changes

This approach updates the frontend to match your existing backend API structure.

---

## Step 1: Add CORS Configuration to Backend

### File: `backend/src/main/java/MKSS/backend/config/SecurityConfig.java`

Add this method inside the `SecurityConfig` class:

```java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(Arrays.asList(
        "http://localhost:5173",
        "http://localhost:3000"
    ));
    configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    configuration.setAllowedHeaders(Arrays.asList("*"));
    configuration.setAllowCredentials(true);
    configuration.setMaxAge(3600L);

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
}
```

And update the SecurityFilterChain to use it:

```java
@Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
        .csrf(csrf -> csrf.disable())
        .cors(cors -> cors.configurationSource(corsConfigurationSource()))  // ADD THIS LINE
        .authorizeHttpRequests(auth -> auth.anyRequest().permitAll());

    return http.build();
}
```

**Why**: This allows your frontend (running on port 5173) to make requests to your backend (port 8080).

---

## Step 2: Fix Frontend API Endpoints

### File: `frontend/src/api/cafekioskApi.ts`

Replace the entire file with this corrected version:

```typescript
import axios from "axios";

// Base URL uses Vite proxy configuration
const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Important for session-based cart
});

// Menu interfaces
export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: {
    id: number;
    name: string;
    description: string;
  };
  imageUrl?: string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  displayOrder: number;
}

// Cart interfaces
export interface CartItem {
  menuItemId: number;
  menuItemName: string;
  price: number;
  quantity: number;
  subtotal: number;
}

// Order interfaces
export interface OrderRequest {
  customerName: string | null;
  items: CartItem[];
}

export interface OrderResponse {
  orderNumber: string;
  customerName: string;
  status: string;
}

// ===== MENU API =====

// FIXED: Backend uses /menu not /menu/items
export const getAllMenuItems = async (): Promise<MenuItem[]> => {
  const response = await api.get("/menu");
  return response.data;
};

// FIXED: Backend uses /menu?categoryId= not /menu/items/category/{id}
export const getMenuItemsByCategory = async (categoryId: number): Promise<MenuItem[]> => {
  const response = await api.get(`/menu?categoryId=${categoryId}`);
  return response.data;
};

export const getMenuItemById = async (id: number): Promise<MenuItem> => {
  const response = await api.get(`/menu/${id}`);
  return response.data;
};

// ===== CATEGORY API =====

// FIXED: Backend uses /categories not /menu/categories
export const getAllCategories = async (): Promise<Category[]> => {
  const response = await api.get("/categories");
  return response.data;
};

// ===== CART API (Session-based) =====

export const getCart = async (): Promise<CartItem[]> => {
  const response = await api.get("/cart");
  return response.data;
};

export const addToCart = async (menuItemId: number, quantity: number): Promise<void> => {
  await api.post("/cart/add", null, {
    params: { menuItemId, quantity }
  });
};

export const clearCart = async (): Promise<void> => {
  await api.post("/cart/clear");
};

// ===== ORDER API =====

// FIXED: Backend uses /order/checkout not /orders
export const createOrder = async (orderRequest: OrderRequest): Promise<OrderResponse> => {
  // Note: Backend expects cart to be in session, but we'll send items anyway
  // You may need to modify backend to accept this, or switch to session-based cart
  const response = await api.post("/order/checkout", orderRequest);
  return response.data;
};

export const getOrderByNumber = async (orderNumber: string): Promise<OrderResponse> => {
  const response = await api.get(`/order/${orderNumber}`);
  return response.data;
};

export default api;
```

**Key Changes**:
- `/menu/items` → `/menu`
- `/menu/categories` → `/categories`
- `/menu/items/category/{id}` → `/menu?categoryId={id}`
- `/orders` → `/order/checkout`
- Added `withCredentials: true` for session support

---

## Step 3: Fix Order Creation in CartPage

### File: `frontend/src/pages/CartPage.tsx`

**Line 5-6**, change from:
```typescript
//import { createOrder } from "../api/cafekioskApi";
import { createOrder } from "../api/createOrderMock";
```

**To**:
```typescript
import { createOrder } from "../api/cafekioskApi";
// Remove mock import
```

**Why**: This switches from fake/mock order creation to the real API.

---

## Step 4: Fix Menu Display (Remove Mock Data)

### File: `frontend/src/pages/TestMenu.tsx`

This file has a huge hardcoded fake menu array (lines 76-145). You have two options:

**Option A: Replace TestMenu with MenuList component** (RECOMMENDED)

In `frontend/src/App.tsx`, check which menu component is being used in routes. Make sure it uses `MenuList.tsx` not `TestMenu.tsx`.

**Option B: Fix TestMenu to use real API**

Replace the hardcoded `allItems` array with an API call. At the top of the component, add:

```typescript
import { getAllMenuItems, MenuItem } from "../api/cafekioskApi";
import { useState, useEffect } from "react";

// Inside TestMenu component:
const [allItems, setAllItems] = useState<MenuItem[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
  const fetchMenu = async () => {
    try {
      setLoading(true);
      const items = await getAllMenuItems();
      setAllItems(items);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch menu:", err);
      setError("Failed to load menu items");
    } finally {
      setLoading(false);
    }
  };

  fetchMenu();
}, []);

// Add loading/error states in JSX
if (loading) return <div>Loading menu...</div>;
if (error) return <div>Error: {error}</div>;
```

Then remove the hardcoded array (lines 76-145).

---

## Step 5: Fix Direct Backend Calls

### File: `frontend/src/pages/TestMenu2.tsx`

**Line 34**, change from:
```typescript
const response = await axios.get("http://localhost:8080/menu");
```

**To**:
```typescript
import { getAllMenuItems } from "../api/cafekioskApi";

// Then in the useEffect:
const items = await getAllMenuItems();
setMenuItems(items);
```

**Why**: Use the API client instead of hardcoded URLs. This respects the proxy configuration.

---

## Step 6: Decide on Cart Strategy

You currently have **TWO cart systems** that don't talk to each other:

### Current Situation:
- **Frontend**: Client-side cart stored in localStorage (CartContext.tsx)
- **Backend**: Session-based cart stored on server

### Choose One Strategy:

#### Option A: Keep Client-Side Cart (EASIER)

**Pros**: Less API calls, works offline, simpler frontend
**Cons**: Requires backend changes to accept items in order request

**Required Backend Change**: Modify `OrderController.checkout()` to:
1. Accept `OrderRequest` with items in request body
2. Don't rely on session cart
3. Create order from request items

**Frontend**: No changes needed (CartContext continues working)

#### Option B: Switch to Server-Side Cart (MORE WORK)

**Pros**: Single source of truth, better for multi-device
**Cons**: More API calls, requires session management

**Required Frontend Changes**:
1. Remove CartContext localStorage logic
2. Call `/cart/add` API for each item added
3. Call `/cart` API to fetch cart on page load
4. Call `/cart/clear` after checkout

**Backend**: No changes needed (already supports this)

**My Recommendation**: **Option A** (keep client-side cart) for simplicity.

---

## Step 7: Update Backend OrderController (If keeping client-side cart)

### File: `backend/src/main/java/MKSS/backend/Controller/OrderController.java`

Modify the `checkout` method to accept items from request body instead of session:

```java
@PostMapping("/checkout")
public ResponseEntity<OrderResponse> checkout(
        @Valid @RequestBody OrderRequest request,
        HttpSession session) {

    // If request has items, use those instead of session cart
    if (request.getItems() != null && !request.getItems().isEmpty()) {
        OrderResponse response = orderService.createOrder(request);
        return ResponseEntity.ok(response);
    }

    // Otherwise fall back to session cart (existing behavior)
    List<CartItem> cart = CartService.getCart(session);
    if (cart == null || cart.isEmpty()) {
        throw new EmptyCartException("Cart is empty");
    }

    OrderRequest orderRequest = new OrderRequest();
    orderRequest.setCustomerName(request.getCustomerName());
    orderRequest.setItems(cart);

    OrderResponse response = orderService.createOrder(orderRequest);

    // Clear cart after successful order
    session.removeAttribute("CART");

    return ResponseEntity.ok(response);
}
```

**This allows both approaches to work**.

---

## Step 8: Enhance OrderResponse (Optional but Recommended)

### File: `backend/src/main/java/MKSS/backend/dto/OrderResponse.java`

Add more fields to match frontend expectations:

```java
package MKSS.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {
    private String orderNumber;
    private String customerName;
    private String status;
    private BigDecimal totalAmount;  // ADD THIS
    private LocalDateTime createdAt;  // ADD THIS
    private List<OrderItemResponse> items;  // ADD THIS
}
```

Create `OrderItemResponse.java`:

```java
package MKSS.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemResponse {
    private Long id;
    private String menuItemName;
    private Integer quantity;
    private BigDecimal price;
    private BigDecimal subtotal;
}
```

Update `OrderService.java` to populate these fields.

---

## Step 9: Test the Integration

### 9.1 Start Both Servers

**Terminal 1 - Backend**:
```bash
cd backend
mvn spring-boot:run
```

Wait for: `Started BackendApplication in X seconds`

**Terminal 2 - Frontend**:
```bash
cd frontend
npm run dev
```

Open: http://localhost:5173

### 9.2 Test Checklist

- [ ] Menu items load from database (not hardcoded)
- [ ] Category filtering works
- [ ] Can add items to cart
- [ ] Cart displays correct items and totals
- [ ] Can place an order
- [ ] Order confirmation shows order number
- [ ] Check backend logs for API calls
- [ ] Check browser Network tab for successful API responses

### 9.3 Common Issues

**Issue**: Menu doesn't load, CORS error in console
- **Fix**: Make sure you added CORS configuration to SecurityConfig (Step 1)

**Issue**: 404 errors for API calls
- **Fix**: Verify Vite proxy is running (`vite.config.ts` is correct)
- Backend must be on port 8080
- Frontend must use `/api` prefix in URLs

**Issue**: Cart is empty after adding items
- **Fix**: Make sure `withCredentials: true` is set in api client
- Check if cookies are enabled in browser

**Issue**: Order creation fails
- **Fix**: Check OrderController accepts items in request body (Step 7)
- Check console for validation errors

---

## Step 10: Clean Up (Optional)

After everything works, remove unused files:

```bash
# Remove mock files
rm frontend/src/api/createOrderMock.ts

# If using MenuList.tsx, remove TestMenu.tsx
rm frontend/src/pages/TestMenu.tsx
rm frontend/src/pages/TestMenu2.tsx

# Remove duplicate API file
rm frontend/src/service/api.ts
```

Update imports in any files that referenced these.

---

## 🎉 Integration Complete Checklist

- [ ] Step 1: CORS configured in backend
- [ ] Step 2: API endpoints fixed in cafekioskApi.ts
- [ ] Step 3: CartPage uses real API (not mock)
- [ ] Step 4: Menu uses real API (not hardcoded data)
- [ ] Step 5: TestMenu2 uses API client
- [ ] Step 6: Decided on cart strategy
- [ ] Step 7: OrderController updated (if needed)
- [ ] Step 8: OrderResponse enhanced (optional)
- [ ] Step 9: All tests pass
- [ ] Step 10: Cleaned up unused files

---

## 📚 Next Steps After Integration

1. **Add Loading States**: Show spinners while fetching data
2. **Add Error Handling**: Display user-friendly error messages
3. **Add Validation**: Validate forms before submission
4. **Add Authentication**: Implement user login (JWT tokens)
5. **Deploy**: Follow the Render deployment guide

---

## 🆘 Need Help?

If you get stuck on any step:

1. Check browser console for errors (F12)
2. Check backend logs for stack traces
3. Use Swagger UI: http://localhost:8080/swagger-ui.html
4. Test APIs directly with Postman/curl
5. Ask your team for help!

---

## 📖 Key Differences Between Frontend & Backend

| Aspect | Frontend | Backend |
|--------|----------|---------|
| **Menu endpoint** | `/menu` | `/menu` ✅ |
| **Categories** | `/categories` | `/categories` ✅ |
| **Cart storage** | localStorage (client) | Session (server) ⚠️ |
| **Order endpoint** | `/order/checkout` | `/order/checkout` ✅ |
| **Data format** | JSON (snake_case) | JSON (camelCase) ✅ |

**Legend**: ✅ = Fixed, ⚠️ = Requires decision

---

Good luck! Take it step by step and test after each change.
