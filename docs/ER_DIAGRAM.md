# Cafe Kiosk — テーブルとの関連図 (ER Diagram)

Table relationships, columns, data types, and primary/foreign keys.

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
        DECIMAL(10_2) price             "Item price (e.g. 3000.00)"
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
        DECIMAL(10_2) total_amount      "Sum of all order items"
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
        DECIMAL(10_2) price             "Unit price at time of order"
        DECIMAL(10_2) subtotal          "price x quantity"
    }

    categories   ||--o{ menu_items  : "has many"
    orders       ||--|{ order_items  : "contains"
    menu_items   ||--o{ order_items  : "referenced by"
```

## Relations

| From | To | Type | Description |
|---|---|---|---|
| `categories` | `menu_items` | One-to-Many | One category holds many menu items |
| `orders` | `order_items` | One-to-Many | One order contains one or more items |
| `menu_items` | `order_items` | One-to-Many | A menu item can appear in many orders |

## OrderStatus Enum

| Value | Description |
|---|---|
| `PENDING` | Order received, waiting to be processed |
| `PREPARING` | Kitchen is preparing the order |
| `READY` | Order is ready for pickup |
| `COMPLETED` | Order has been picked up / fulfilled |
