# Cafe Kiosk — イベント定義 (API Event Definitions)

All REST API endpoints exposed by the Spring Boot backend, including request/response contracts.

```mermaid
sequenceDiagram
    participant Browser as 🌐 Browser (React)
    participant API as 🖥️ Spring Boot API
    participant DB as 🗄️ Database

    Note over Browser,DB: ─── MENU EVENTS ───

    Browser->>API: GET /menu
    API->>DB: SELECT * FROM menu_items WHERE available=true
    DB-->>API: List of MenuItem
    API-->>Browser: 200 OK — List of MenuItem (JSON)

    Browser->>API: GET /menu?categoryId=1
    API->>DB: SELECT * WHERE category_id=1 AND available=true
    DB-->>API: List of MenuItem
    API-->>Browser: 200 OK — Filtered List of MenuItem

    Note over Browser,DB: ─── CATEGORY EVENTS ───

    Browser->>API: GET /categories
    API->>DB: SELECT * FROM categories ORDER BY display_order ASC
    DB-->>API: List of Category
    API-->>Browser: 200 OK — List of Category (JSON)

    Note over Browser,DB: ─── CART EVENTS (Session-based) ───

    Browser->>API: GET /cart
    API-->>Browser: 200 OK — { cartItems, cartTotal }

    Browser->>API: POST /cart/add?menuItemId=1&quantity=2
    API-->>Browser: 200 OK — { success: true, message: "Item added to cart" }

    Browser->>API: POST /cart/clear
    API-->>Browser: 200 OK — { success: true, message: "Cart cleared" }

    Note over Browser,DB: ─── ORDER EVENTS ───

    Browser->>API: POST /order/checkout  { customerName, items[] }
    API->>DB: INSERT INTO orders (order_number, total_amount, status=PENDING ...)
    API->>DB: INSERT INTO order_items (order_id, menu_item_id, quantity, price, subtotal) x N
    DB-->>API: Saved Order
    API-->>Browser: 200 OK — OrderResponse { orderNumber, status, totalAmount, items[] }

    Note over Browser,DB: ─── ERROR RESPONSES ───
    API-->>Browser: 400 Bad Request — EmptyCartException
    API-->>Browser: 404 Not Found — ResourceNotFoundException (MenuItem not found)
```

## Endpoint Summary

| Method | Endpoint | Description | Response |
|---|---|---|---|
| `GET` | `/categories` | Get all categories sorted by display order | `List<Category>` |
| `GET` | `/menu` | Get all available menu items | `List<MenuItem>` |
| `GET` | `/menu?categoryId={id}` | Get available menu items filtered by category | `List<MenuItem>` |
| `GET` | `/cart` | View current session cart | `{ cartItems, cartTotal }` |
| `POST` | `/cart/add` | Add item to session cart | `{ success, message }` |
| `POST` | `/cart/clear` | Clear session cart | `{ success, message }` |
| `POST` | `/order/checkout` | Place an order (client-side or session cart) | `OrderResponse` |

## Request / Response Schema

```
OrderRequest {
  customerName : String          (optional)
  items[]      : CartItem[]
    ├─ menuItemId  : Long
    ├─ quantity    : Integer
    ├─ price       : BigDecimal
    └─ subtotal    : BigDecimal
}

OrderResponse {
  orderNumber   : String         e.g. "ORD-20260303-0001"
  customerName  : String
  status        : String         "PENDING"
  totalAmount   : BigDecimal
  orderedAt     : LocalDateTime  "yyyy-MM-dd'T'HH:mm:ss"
  items[]       : OrderItemResponse[]
    ├─ menuItemName : String
    ├─ price        : BigDecimal
    ├─ quantity     : Integer
    └─ subtotal     : BigDecimal
}
```

## Error Responses

| Status | Exception | Trigger |
|---|---|---|
| `400 Bad Request` | `EmptyCartException` | Checkout called with no items in cart |
| `404 Not Found` | `ResourceNotFoundException` | `menuItemId` does not exist in DB |
