# Cafe Kiosk — 機能のアーキテクチャ (Functional Architecture)

Overview of all layers, components, and their responsibilities across the system.

```mermaid
flowchart TB

    subgraph CLIENT ["🌐 Client Layer — Browser"]
        direction TB

        subgraph PAGES ["Pages (React Router v6)"]
            P1["/ — Home\nCafe splash image"]
            P2["/menu — MenuList\nMenu grid + category filter\nDetail modal"]
            P3["/cart — CartPage\nCart review + checkout"]
            P4["/order-complete — OrderPage\nOrder confirmation display"]
        end

        subgraph COMPONENTS ["Shared Components"]
            C1["Navbar\nRoute links + cart badge"]
            C2["Footer\nStatic footer"]
            C3["RightSidebar\nCart preview panel"]
            C4["BottomCartBar\nMobile cart shortcut"]
            C5["MenuDetailModal\nItem detail + add to cart"]
            C6["OrderSuccessAnimation\nConfetti / success anim (1.1s)"]
            C7["Cart / CartItem\nCart list rendering"]
            C8["OrderComplete\nOrder summary display"]
        end

        subgraph STATE ["State Management"]
            S1["CartContext\n(React Context API)\n─────────────────\ncart[]\naddToCart()\nremoveFromCart()\nupdateQuantity()\nclearCart()\ngetCartTotal()\nlocalStorage sync"]
        end

        subgraph APILAY ["API Layer"]
            A1["cafekioskApi.ts\n(Axios)\n─────────────────\ngetAllMenuItems()\ngetMenuItemsByCategory()\ngetCategories()\ngetCart()\naddToCart()\nclearCart()\ncreateOrder()"]
        end

        PAGES --> COMPONENTS
        PAGES --> STATE
        PAGES --> APILAY
        COMPONENTS --> STATE
    end

    subgraph INFRA_PROXY ["🔀 Proxy / Reverse Proxy"]
        VITE["Vite Dev Proxy\n/api → localhost:8080\n(development)"]
        NGINX["Nginx\nReverse Proxy\n(production)\nport 80/443 → 8080"]
    end

    subgraph BACKEND ["🖥️ Backend Layer — Spring Boot 3"]
        direction TB

        subgraph CONTROLLERS ["Controllers (@RestController)"]
            BC1["CategoryController\nGET /categories"]
            BC2["MenuController\nGET /menu\nGET /menu?categoryId"]
            BC3["CartController\nGET /cart\nPOST /cart/add\nPOST /cart/clear"]
            BC4["OrderController\nPOST /order/checkout"]
            BC5["HomeController\nGET /\nServes static SPA"]
        end

        subgraph SERVICES ["Services (@Service)"]
            BS1["MenuService\ngetAllCategories()\ngetMenuItemsByCategory()\ngetAllAvailableMenuItems()"]
            BS2["CartService\ngetCart()\naddToCart()\nclearCart()\ngetCartTotal()"]
            BS3["OrderService\ncreateOrder()\ngenerateOrderNumber()\ncalculate totals"]
        end

        subgraph REPOS ["Repositories (Spring Data JPA)"]
            BR1["CategoryRepository\nfindAllByOrderByDisplayOrderAsc()"]
            BR2["MenuItemRepository\nfindByAvailableTrue()\nfindByCategoryIdAndAvailableTrue()"]
            BR3["OrderRepository\nsave()\ncount()"]
        end

        subgraph MODELS ["Models (@Entity)"]
            M1["Category\nid, name, description\ndisplay_order, created_at"]
            M2["MenuItem\nid, name, description\nprice, image_url\navailable, category_id"]
            M3["Order\nid, order_number\ncustomer_name, total_amount\nstatus, ordered_at\ncreated_at, updated_at"]
            M4["OrderItem\nid, order_id, menu_item_id\nquantity, price, subtotal"]
            M5["OrderStatus (Enum)\nPENDING / PREPARING\nREADY / COMPLETED"]
        end

        subgraph EXCEPTIONS ["Exception Handling"]
            E1["GlobalExceptionHandler\n(@ControllerAdvice)"]
            E2["EmptyCartException → 400"]
            E3["ResourceNotFoundException → 404"]
            E4["BadRequestException → 400"]
        end

        subgraph DTOS ["DTOs"]
            D1["OrderRequest\ncustomerName, items[]"]
            D2["OrderResponse\norderNumber, status\ntotalAmount, items[]"]
            D3["CartItem\nmenuItemId, quantity\nprice, subtotal"]
        end

        subgraph SESSION ["Session (HttpSession)"]
            SE1["Server-side cart\nFallback when no\nclient cart provided"]
        end

        BC1 --> BS1
        BC2 --> BS1
        BC3 --> BS2
        BC3 --> SE1
        BC4 --> BS3
        BC4 --> BS2
        BS1 --> BR1
        BS1 --> BR2
        BS2 --> SE1
        BS3 --> BR3
        BS3 --> BR2
        BR1 --> M1
        BR2 --> M2
        BR3 --> M3
        M3 --> M4
        M2 --> M4
        M3 --> M5
        BC4 --> EXCEPTIONS
    end

    subgraph DATA ["🗄️ Data Layer"]
        DB1[("MySQL\n(Production)\nAWS RDS or EC2")]
        DB2[("H2 In-Memory\n(Development)\nauto-configured")]
        JPA["Spring Data JPA\n+ Hibernate ORM\n@PrePersist / @PreUpdate\nCascadeType.ALL"]
    end

    subgraph STORAGE ["☁️ External Storage"]
        S3["AWS S3\nMenu item images\nimage_url stored in DB"]
    end

    subgraph DEPLOY ["🚀 Deployment"]
        EC2["AWS EC2\nUbuntu Server\nJava 17 runtime\ncafe_kiosk.jar"]
        SRV["Render.com\n(Alternative)\nDocker / JAR deploy"]
    end

    %% Client to proxy
    APILAY -->|HTTP requests| VITE
    APILAY -->|HTTP requests| NGINX

    %% Proxy to backend
    VITE -->|"/api/* proxy"| CONTROLLERS
    NGINX -->|"port 8080"| CONTROLLERS

    %% Backend to DB
    REPOS -->|JPA / JDBC| JPA
    JPA --> DB1
    JPA --> DB2

    %% Images
    P2 -->|"image_url (S3 URL)"| S3

    %% Deployment
    EC2 --> BACKEND
    SRV --> BACKEND

    classDef page     fill:#dbeafe,stroke:#3b82f6,color:#1e3a5f
    classDef comp     fill:#ede9fe,stroke:#7c3aed,color:#2e1065
    classDef state    fill:#dcfce7,stroke:#16a34a,color:#14532d
    classDef api      fill:#fef9c3,stroke:#ca8a04,color:#713f12
    classDef ctrl     fill:#d1fae5,stroke:#059669,color:#064e3b
    classDef svc      fill:#ecfdf5,stroke:#10b981,color:#064e3b
    classDef repo     fill:#f0fdf4,stroke:#22c55e,color:#14532d
    classDef model    fill:#fff7ed,stroke:#f97316,color:#7c2d12
    classDef exc      fill:#fee2e2,stroke:#ef4444,color:#7f1d1d
    classDef db       fill:#fefce8,stroke:#eab308,color:#713f12
    classDef infra    fill:#f1f5f9,stroke:#64748b,color:#1e293b

    class P1,P2,P3,P4 page
    class C1,C2,C3,C4,C5,C6,C7,C8 comp
    class S1 state
    class A1 api
    class BC1,BC2,BC3,BC4,BC5 ctrl
    class BS1,BS2,BS3 svc
    class BR1,BR2,BR3 repo
    class M1,M2,M3,M4,M5 model
    class E1,E2,E3,E4 exc
    class DB1,DB2,JPA db
    class EC2,SRV,NGINX,VITE,S3 infra
```

## Layer Responsibilities

| Layer | Technology | Responsibility |
|---|---|---|
| **Pages** | React 19 + React Router v6 | Screen routing and top-level layout per route |
| **Components** | React + styled-components | Reusable UI blocks (Navbar, Cart, Modal, etc.) |
| **State** | React Context API + localStorage | Global cart state shared across all pages |
| **API Layer** | Axios | HTTP calls to Spring Boot backend, type-safe DTOs |
| **Proxy** | Vite (dev) / Nginx (prod) | Route `/api/*` requests to backend port 8080 |
| **Controllers** | Spring Boot `@RestController` | Accept HTTP requests, delegate to services |
| **Services** | Spring Boot `@Service` | Business logic — order creation, menu filtering |
| **Repositories** | Spring Data JPA | Database queries via JPA interfaces |
| **Models** | JPA `@Entity` | ORM mapping to DB tables with lifecycle hooks |
| **DTOs** | Plain Java classes | Request/response contracts between layers |
| **Exception Handler** | `@ControllerAdvice` | Centralized error handling → HTTP status codes |
| **Database** | MySQL (prod) / H2 (dev) | Persistent storage for menus, orders |
| **Storage** | AWS S3 | Menu item image hosting |
| **Deployment** | AWS EC2 / Render | Runs the Spring Boot JAR + serves frontend static files |

## Tech Stack Summary

```
Frontend  : React 19 · TypeScript · Vite · React Router v6
           styled-components · Bootstrap 5 · Axios · framer-motion

Backend   : Spring Boot 3 · Java 17 · Spring Data JPA · Hibernate
           Lombok · Jakarta EE · HttpSession

Database  : MySQL 8 (production) · H2 (development)

Storage   : AWS S3 (images)

Deploy    : AWS EC2 (Ubuntu) + Nginx  OR  Render.com
```
