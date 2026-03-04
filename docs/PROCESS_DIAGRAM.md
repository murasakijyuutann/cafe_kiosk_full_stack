# Cafe Kiosk — プロセス図 (Order Process Diagram)

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
        R["For each item:\nLookup MenuItem by ID\nBuild OrderItem entity"]
        S["orderRepository.save(order)\nCascades to OrderItem insert\n@PrePersist sets timestamps"]
        T["Build and return OrderResponse\norderNumber, status, totalAmount, items"]
    end

    subgraph DATABASE ["🗄️ Database (MySQL / H2)"]
        U[("INSERT INTO orders\norder_number, customer_name\ntotal_amount, status=PENDING\nordered_at, created_at")]
        V[("INSERT INTO order_items\norder_id, menu_item_id\nquantity, price, subtotal\n× N rows")]
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

## Color Legend

| Color | Layer | Description |
|---|---|---|
| 🔵 Blue | Frontend (React) | UI interactions, navigation, cart state |
| 🟢 Green | Backend (Spring Boot) | Business logic, order creation, validation |
| 🟡 Yellow | Database | SQL INSERT operations |
| 🔴 Red | Errors | Exception responses (400 / 404) |

## Order Number Format

```
ORD-{YYYYMMDD}-{SEQUENCE}
e.g. ORD-20260303-0001

SEQUENCE = (total orders in DB + 1), zero-padded to 4 digits
```

## Order Lifecycle

```
PENDING ──► PREPARING ──► READY ──► COMPLETED
  │
  └─ Set automatically on creation (@PrePersist)
     completedAt recorded when status → COMPLETED (@PreUpdate)
```
