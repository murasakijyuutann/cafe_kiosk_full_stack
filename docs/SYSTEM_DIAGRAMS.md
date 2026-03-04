# Cafe Kiosk — System Diagrams

---

## 1. テーブルとの関連図 — Table Relationship Diagram (ER Diagram)

Shows the database tables, their columns, data types, and how they relate to each other.

```mermaid
erDiagram
    categories {
        BIGINT      id              PK  "Auto-increment primary key"
        VARCHAR(50) name            UK  "Category name (unique)"
        VARCHAR(200) description        "Category description"
        INT         display_order       "Sort order for display"
        DATETIME    created_at          "Record creation timestamp"
    }

    menu_items {
        BIGINT       id             PK  "Auto-increment primary key"
        VARCHAR(100) name               "Menu item name"
        VARCHAR(500) description        "Menu item description"
        DECIMAL(10,2) price             "Item price (e.g. 3000.00)"
        VARCHAR(300) image_url          "S3 image URL"
        BOOLEAN      available          "Whether item is on sale (default: true)"
        BIGINT       category_id    FK  "References categories.id"
        DATETIME     created_at         "Record creation timestamp"
        DATETIME     updated_at         "Last updated timestamp"
    }

    orders {
        BIGINT       id             PK  "Auto-increment primary key"
        VARCHAR(20)  order_number   UK  "Format: ORD-YYYYMMDD-0001"
        VARCHAR(100) customer_name      "Customer name (nullable)"
        DECIMAL(10,2) total_amount      "Sum of all order items"
        VARCHAR(20)  status             "PENDING / PREPARING / READY / COMPLETED"
        DATETIME     ordered_at         "When customer placed the order"
        DATETIME     completed_at       "When order was completed (nullable)"
        DATETIME     created_at         "Record creation timestamp"
        DATETIME     updated_at         "Last updated timestamp"
    }

    order_items {
        BIGINT       id             PK  "Auto-increment primary key"
        BIGINT       order_id       FK  "References orders.id"
        BIGINT       menu_item_id   FK  "References menu_items.id"
        INT          quantity           "Number of items ordered"
        DECIMAL(10,2) price             "Unit price at time of order"
        DECIMAL(10,2) subtotal          "price × quantity"
    }

    categories   ||--o{ menu_items  : "has many"
    orders       ||--|{ order_items  : "contains"
    menu_items   ||--o{ order_items  : "referenced by"
```

### OrderStatus Enum

| Value | Description |
|---|---|
| `PENDING` | Order received, waiting to be processed |
| `PREPARING` | Kitchen is preparing the order |
| `READY` | Order is ready for pickup |
| `COMPLETED` | Order has been picked up / fulfilled |

---

## 2. イベント定義 — API Event Definitions

All REST API endpoints exposed by the Spring Boot backend, including request/response contracts.

```mermaid
sequenceDiagram
    participant Browser as 🌐 Browser (React)
    participant API as 🖥️ Spring Boot API
    participant DB as 🗄️ Database

    Note over Browser,DB: ─── MENU EVENTS ───

    Browser->>API: GET /menu
    API->>DB: SELECT * FROM menu_items WHERE available=true
    DB-->>API: List<MenuItem>
    API-->>Browser: 200 OK — List<MenuItem> (JSON)

    Browser->>API: GET /menu?categoryId=1
    API->>DB: SELECT * WHERE category_id=1 AND available=true
    DB-->>API: List<MenuItem>
    API-->>Browser: 200 OK — Filtered List<MenuItem>

    Note over Browser,DB: ─── CATEGORY EVENTS ───

    Browser->>API: GET /categories
    API->>DB: SELECT * FROM categories ORDER BY display_order ASC
    DB-->>API: List<Category>
    API-->>Browser: 200 OK — List<Category> (JSON)

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
    API->>DB: INSERT INTO order_items (order_id, menu_item_id, quantity, price, subtotal) × N
    DB-->>API: Saved Order
    API-->>Browser: 200 OK — OrderResponse { orderNumber, status, totalAmount, items[] }

    Note over Browser,DB: ─── ERROR RESPONSES ───
    API-->>Browser: 400 Bad Request — EmptyCartException
    API-->>Browser: 404 Not Found — ResourceNotFoundException (MenuItem not found)
```

### Event Summary Table

| Method | Endpoint | Description | Response |
|---|---|---|---|
| `GET` | `/categories` | Get all categories sorted by display order | `List<Category>` |
| `GET` | `/menu` | Get all available menu items | `List<MenuItem>` |
| `GET` | `/menu?categoryId={id}` | Get available menu items filtered by category | `List<MenuItem>` |
| `GET` | `/cart` | View current session cart | `{ cartItems, cartTotal }` |
| `POST` | `/cart/add` | Add item to session cart | `{ success, message }` |
| `POST` | `/cart/clear` | Clear session cart | `{ success, message }` |
| `POST` | `/order/checkout` | Place an order (client-side or session cart) | `OrderResponse` |

### OrderRequest / OrderResponse Schema

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
  orderedAt     : LocalDateTime
  items[]       : OrderItemResponse[]
    ├─ menuItemName : String
    ├─ price        : BigDecimal
    ├─ quantity     : Integer
    └─ subtotal     : BigDecimal
}
```

---

## 3. プロセス図 — Order Process Diagram

End-to-end flow from the customer browsing menus to the order being saved in the database.

```mermaid
flowchart TD
    START([Customer opens the kiosk app])

    subgraph FRONTEND ["🌐 Frontend (React)"]
        A["Browse menu items\n/menu"]
        B["Click item → Open detail modal\nView name / price / description"]
        C{Add to cart?}
        D["Item stored in CartContext\n(React state + localStorage)"]
        E["View cart\n/cart\nSee items, quantities, total"]
        F{Confirm order?}
        G["Cancel — stay on cart"]
        H["Call createOrder()\nPOST /order/checkout"]
        I["Show success animation\n(1.1 seconds)"]
        J["Clear cart (CartContext)"]
        K["Navigate to /order-complete\nDisplay order number & details"]
        L["Click 'Back to Menu'\nnavigate to /menu"]
    end

    subgraph BACKEND ["🖥️ Backend (Spring Boot)"]
        M["OrderController.checkout()\nreceives OrderRequest"]
        N["Validate cart is not empty\n→ throw EmptyCartException if empty"]
        O["Generate order number\nFormat: ORD-YYYYMMDD-XXXX"]
        P["Calculate total amount\nsum of all item subtotals"]
        Q["Build Order entity\nstatus = PENDING"]
        R["For each item:\nLookup MenuItem by ID\n→ throw ResourceNotFoundException if missing\nBuild OrderItem entity"]
        S["orderRepository.save(order)\nCascades to OrderItem insert\n@PrePersist sets timestamps"]
        T["Build & return OrderResponse\norderNumber, status, totalAmount, items"]
    end

    subgraph DATABASE ["🗄️ Database (MySQL / H2)"]
        U[("INSERT INTO orders\n(order_number, customer_name,\n total_amount, status='PENDING',\n ordered_at, created_at)")]
        V[("INSERT INTO order_items\n(order_id, menu_item_id,\n quantity, price, subtotal) × N")]
    end

    START --> A
    A --> B
    B --> C
    C -->|Yes| D
    C -->|No| A
    D --> A
    A -->|Go to cart| E
    E --> F
    F -->|Cancel| G
    G --> E
    F -->|OK| H

    H --> M
    M --> N
    N -->|Valid| O
    N -->|Empty| ERR1["400 Bad Request\nEmptyCartException"]
    O --> P
    P --> Q
    Q --> R
    R -->|Item found| S
    R -->|Not found| ERR2["404 Not Found\nResourceNotFoundException"]
    S --> U
    U --> V
    V --> T
    T --> I

    I --> J
    J --> K
    K --> L
    L --> A

    ERR1 -.->|Error alert shown| E
    ERR2 -.->|Error alert shown| E

    classDef frontend fill:#e8f4fd,stroke:#4a90d9,color:#1a1a1a
    classDef backend  fill:#e8f9e8,stroke:#2d6a4f,color:#1a1a1a
    classDef db       fill:#fff8e1,stroke:#f39c12,color:#1a1a1a
    classDef error    fill:#fde8e8,stroke:#e74c3c,color:#721c24
    classDef start    fill:#2d6a4f,stroke:#1b4332,color:#fff

    class A,B,C,D,E,F,G,H,I,J,K,L frontend
    class M,N,O,P,Q,R,S,T backend
    class U,V db
    class ERR1,ERR2 error
    class START start
```

### Order Number Generation Rule

```
Format : ORD-{YYYYMMDD}-{SEQUENCE}
Example: ORD-20260303-0001

- YYYYMMDD  = current date
- SEQUENCE  = (total order count in DB + 1), zero-padded to 4 digits
```

### Order Lifecycle

```
PENDING ──► PREPARING ──► READY ──► COMPLETED
  │
  └─ Initial status set automatically on order creation (@PrePersist)
     completedAt is recorded when status transitions to COMPLETED (@PreUpdate)
```
