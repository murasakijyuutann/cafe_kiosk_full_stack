# 카페 키오스크 프로젝트 - 초보자용 간단 가이드 자바랑 데이터베이스용

## 4인 팀 프로젝트 (간소화 버전)

---

## 📚 목차

1. [프로젝트 개요](#프로젝트-개요)
2. [파일 구조](#파일-구조)
3. [데이터베이스 스키마](#데이터베이스-스키마)
4. [팀 역할 분담](#팀-역할-분담)
5. [단계별 개발 가이드](#단계별-개발-가이드)
6. [전체 코드 예제](#전체-코드-예제)
7. [주차별 일정](#주차별-일정)

---

## 프로젝트 개요

### 아키텍처

```
┌─────────────────────────────────────────────────────────┐
│                     Client Browser                       │
│              (React SPA on port 5173)                    │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP/HTTPS
                     │ Axios Requests
                     │
┌────────────────────▼────────────────────────────────────┐
│              Spring Boot REST API                        │
│                 (port 8080)                              │
│  ┌────────────────────────────────────────────────┐      │
│  │  REST Controllers (/api/*)                     │      │
│  │  - MenuApiController                           │      │
│  │  - OrderApiController                          │      │
│  └────────────┬───────────────────────────────────┘      │
│               │                                          │
│  ┌────────────▼───────────────────────────────────┐      │
│  │  Service Layer                                 │      │
│  │  - MenuService                                 │      │
│  │  - OrderService                                │      │
│  └────────────┬───────────────────────────────────┘      │
│               │                                          │
│  ┌────────────▼───────────────────────────────────┐      │
│  │  Repository Layer (Spring Data JPA)            │      │
│  └────────────┬───────────────────────────────────┘      │
└───────────────┼──────────────────────────────────────────┘
                │
┌───────────────▼──────────────────────────────────────────┐
│                    MySQL Database                        │
│         (categories, menu_items, orders, order_items)    │
└──────────────────────────────────────────────────────────┘

```

### 프로젝트명

**CafeKiosk** - 셀프 서비스 카페 주문 키오스크

### 핵심 기능

✅ 메뉴 카테고리별 조회 (커피, 디저트, 음료)
✅ 장바구니에 항목 추가
✅ 주문 생성 및 총액 계산
✅ 주문 완료 확인 페이지

### 기술 스택

- **Backend**: Spring Boot 3.5.6, Java 21
- **Database**: MySQL 8.0
- **Frontend**: Thymeleaf + Bootstrap 5
- **Build Tool**: Maven

### 제외된 기능 (간소화)

❌ 로그인/회원가입 (인증 없음)
❌ 관리자 페널 (나중에 추가 가능)
❌ 결제 연동 (일단 모의 결제)
❌ REST API (웹 페이지만)

---

## 파일 구조

```
cafe-kiosk/
├── pom.xml # Maven 의존성
├── .env # DB 자격증명 (커밋하지 말 것!)
├── .gitignore
├── README.md
│
├── src/
│ ├── main/
│ │ ├── java/com/cafekiosk/
│ │ │ ├── CafekioskApplication.java # 메인 실행 파일
│ │ │ │
│ │ │ ├── model/ # 📦 엔티티 (팀원 1)
│ │ │ │ ├── Category.java # 카테고리 (커피, 디저트 등)
│ │ │ │ ├── MenuItem.java # 메뉴 항목
│ │ │ │ ├── Order.java # 주문
│ │ │ │ ├── OrderItem.java # 주문 항목
│ │ │ │ └── OrderStatus.java # 주문 상태 enum
│ │ │ │
│ │ │ ├── repository/ # 🗄️ DB 접근 (팀원 1)
│ │ │ │ ├── CategoryRepository.java
│ │ │ │ ├── MenuItemRepository.java
│ │ │ │ └── OrderRepository.java
│ │ │ │
│ │ │ ├── dto/ # 📄 데이터 전송 객체 (팀원 2)
│ │ │ │ ├── CartItem.java # 장바구니 항목
│ │ │ │ ├── OrderRequest.java # 주문 요청
│ │ │ │ └── OrderResponse.java # 주문 응답
│ │ │ │
│ │ │ ├── service/ # ⚙️ 비즈니스 로직 (팀원 2)
│ │ │ │ ├── MenuService.java # 메뉴 조회
│ │ │ │ ├── CartService.java # 장바구니 관리
│ │ │ │ └── OrderService.java # 주문 생성
│ │ │ │
│ │ │ ├── controller/ # 🎮 컨트롤러 (팀원 3)
│ │ │ │ ├── HomeController.java # 홈 페이지
│ │ │ │ ├── MenuController.java # 메뉴 페이지
│ │ │ │ ├── CartController.java # 장바구니
│ │ │ │ └── OrderController.java # 주문 처리
│ │ │ │
│ │ │ ├── exception/ # ⚠️ 예외 처리 (팀원 3)
│ │ │ │ ├── GlobalExceptionHandler.java
│ │ │ │ └── ResourceNotFoundException.java
│ │ │ │
│ │ │ └── config/ # ⚙️ 설정 (팀 리더)
│ │ │ └── WebConfig.java
│ │ │
│ │ └── resources/
│ │ ├── application.yml # 앱 설정
│ │ ├── data.sql # 샘플 데이터
│ └── test/
│ └── java/com/cafekiosk/
│ ├── service/
│ │ └── OrderServiceTest.java
│ └── repository/
│ └── MenuItemRepositoryTest.java
│
└── docs/
└── TEAM_TASKS.md # 팀원별 할일 목록
```

**총 파일 수**: ~20개 (관리 가능한 수준!)

---

## 데이터베이스 스키마

### ERD (Entity Relationship Diagram)

```

```

---

┌─────────────────┐
│    Category     │
├─────────────────┤
│ id (PK)         │
│ name            │
│ description     │
│ display_order   │
└────────┬────────┘
         │
         │ 1:N
         │
         ▼
┌─────────────────┐
│    MenuItem     │
├─────────────────┤
│ id (PK)         │
│ name            │
│ description     │
│ price           │
│ image_url       │
│ available       │
│ category_id(FK) │
└────────┬────────┘
         │
         │ N:M (through OrderItem)
         │
         ▼
┌─────────────────┐         ┌─────────────────┐
│     Order       │ 1:N     │   OrderItem     │
├─────────────────┤◄────────┤─────────────────┤
│ id (PK)         │         │ id (PK)         │
│ order_number    │         │ order_id (FK)   │
│ customer_name   │         │ menu_item_id(FK)│
│ total_amount    │         │ quantity        │
│ status          │         │ price           │
│ ordered_at      │         │ subtotal        │
└─────────────────┘         └─────────────────┘

```

### 테이블 스키마 (MySQL)

#### 1. `categories` 테이블

```sql
CREATE TABLE categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(200),
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE categories CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

**컬럼 설명:**

- `id`: 카테고리 고유 ID
- `name`: 카테고리 이름 (예: "커피", "디저트", "음료")
- `description`: 카테고리 설명
- `display_order`: 화면 표시 순서 (작을수록 먼저)
- `created_at`: 생성 시간

**샘플 데이터:**

```sql
INSERT INTO categories (name, description, display_order) VALUES
('커피', '신선한 원두로 만든 커피', 1),
('디저트', '달콤한 디저트', 2),
('음료', '시원한 음료', 3);
```

---

#### 2. `menu_items` 테이블

```sql
CREATE TABLE menu_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(500),
    price DECIMAL(10, 2) NOT NULL,
    image_url VARCHAR(300),
    available BOOLEAN DEFAULT TRUE,
    category_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (category_id) REFERENCES categories(id),
    INDEX idx_category (category_id),
    INDEX idx_available (available)
);
```

**컬럼 설명:**

- `id`: 메뉴 항목 고유 ID
- `name`: 메뉴 이름 (예: "아메리카노", "카페라떼")
- `description`: 메뉴 설명
- `price`: 가격 (DECIMAL 사용 - 정확한 금액 계산)
- `image_url`: 이미지 URL
- `available`: 판매 가능 여부 (품절 시 false)
- `category_id`: 카테고리 외래키
- `created_at`: 생성 시간
- `updated_at`: 수정 시간

**샘플 데이터:**

```sql
INSERT INTO menu_items (name, description, price, image_url, available, category_id) VALUES
-- 커피 (category_id = 1)
('아메리카노', '깔끔한 에스프레소와 물', 3000.00, '/images/menu/americano.jpg', TRUE, 1),
('카페라떼', '부드러운 우유와 에스프레소', 3500.00, '/images/menu/latte.jpg', TRUE, 1),
('카푸치노', '풍성한 거품과 에스프레소', 3500.00, '/images/menu/cappuccino.jpg', TRUE, 1),

-- 디저트 (category_id = 2)
('초콜릿 케이크', '진한 초콜릿 케이크', 5000.00, '/images/menu/choco-cake.jpg', TRUE, 2),
('치즈케이크', '부드러운 뉴욕 스타일', 5500.00, '/images/menu/cheesecake.jpg', TRUE, 2),
('크루아상', '바삭한 버터 크루아상', 3000.00, '/images/menu/croissant.jpg', TRUE, 2),

-- 음료 (category_id = 3)
('오렌지 주스', '신선한 오렌지 주스', 4000.00, '/images/menu/orange-juice.jpg', TRUE, 3),
('딸기 스무디', '달콤한 딸기 스무디', 4500.00, '/images/menu/strawberry-smoothie.jpg', TRUE, 3);
```

---

#### 3. `orders` 테이블

```sql
CREATE TABLE orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_number VARCHAR(20) NOT NULL UNIQUE,
    customer_name VARCHAR(100),
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) NOT NULL,
    ordered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_order_number (order_number),
    INDEX idx_status (status),
    INDEX idx_ordered_at (ordered_at)
);
```

**컬럼 설명:**

- `id`: 주문 고유 ID
- `order_number`: 주문 번호 (예: "ORD-20250107-001")
- `customer_name`: 고객 이름 (선택사항)
- `total_amount`: 총 금액
- `status`: 주문 상태 (PENDING, PREPARING, READY, COMPLETED)
- `ordered_at`: 주문 시간
- `completed_at`: 완료 시간
- `created_at`: 생성 시간
- `updated_at`: 수정 시간

---

#### 4. `order_items` 테이블

```sql
CREATE TABLE order_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    menu_item_id BIGINT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,

    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (menu_item_id) REFERENCES menu_items(id),
    INDEX idx_order (order_id)
);
```

**컬럼 설명:**

- `id`: 주문 항목 고유 ID
- `order_id`: 주문 외래키
- `menu_item_id`: 메뉴 항목 외래키
- `quantity`: 수량
- `price`: 주문 당시 가격 (가격 변동 대비)
- `subtotal`: 소계 (price × quantity)

**중요:** `ON DELETE CASCADE` - 주문 삭제 시 주문 항목도 함께 삭제

---

### 데이터베이스 관계 요약

| 관계                     | 설명                                    |
| ------------------------ | --------------------------------------- |
| **Category → MenuItem**  | 1:N (한 카테고리는 여러 메뉴 항목 포함) |
| **Order → OrderItem**    | 1:N (한 주문은 여러 주문 항목 포함)     |
| **MenuItem → OrderItem** | 1:N (한 메뉴는 여러 주문에 포함 가능)   |

---

### 인덱스 전략

```sql
-- 자주 조회되는 컬럼에 인덱스 생성
CREATE INDEX idx_menu_category ON menu_items(category_id);
CREATE INDEX idx_menu_available ON menu_items(available);
CREATE INDEX idx_order_status ON orders(status);
CREATE INDEX idx_order_date ON orders(ordered_at);
```

**인덱스 이유:**

- 카테고리별 메뉴 조회가 빠름
- 판매 가능한 메뉴만 필터링
- 주문 상태별 조회 (PENDING, READY 등)
- 날짜별 주문 통계

---

## 팀 역할 분담

### 👤 팀원 1: 데이터베이스 계층

**파일:** `model/` + `repository/`

**작업 내용:**

1. ✅ Entity 5개 작성

   - `Category.java`
   - `MenuItem.java`
   - `Order.java`
   - `OrderItem.java`
   - `OrderStatus.java` (enum)

2. ✅ Repository 3개 작성
   - `CategoryRepository.java`
   - `MenuItemRepository.java`
   - `OrderRepository.java`

**예상 소요 시간:** 2-3일

---

### 👤 팀원 2: 비즈니스 로직

**파일:** `dto/` + `service/`

**작업 내용:**

1. ✅ DTO 3개 작성

   - `CartItem.java`
   - `OrderRequest.java`
   - `OrderResponse.java`

2. ✅ Service 3개 작성
   - `MenuService.java`
   - `CartService.java`
   - `OrderService.java`

**예상 소요 시간:** 3-4일

---

### 👤 팀원 3: 컨트롤러

**파일:** `controller/` + `exception/`

**작업 내용:**

1. ✅ Controller 4개 작성

   - `HomeController.java`
   - `MenuController.java`
   - `CartController.java`
   - `OrderController.java`

2. ✅ Exception 2개 작성
   - `GlobalExceptionHandler.java`
   - `ResourceNotFoundException.java`

**예상 소요 시간:** 3-4일

## 단계별 개발 가이드

### 1단계: 프로젝트 초기화 (1일차)

#### 1.1 Spring Initializr로 프로젝트 생성

1. https://start.spring.io/ 접속
2. 설정:

   ```
   Project: Maven
   Language: Java
   Spring Boot: 3.5.6
   Java: 21
   Group: com.cafekiosk
   Artifact: cafe-kiosk
   Packaging: Jar
   ```

3. Dependencies 추가:

   - Spring Web
   - Spring Data JPA
   - MySQL Driver
   - Thymeleaf
   - Lombok
   - Validation

4. **GENERATE** 클릭 후 다운로드

---

#### 1.2 프로젝트 설정

**`.env` 파일 생성** (루트 디렉토리):

```properties
DB_USERNAME=root
DB_PASSWORD=your_password
```

**`.gitignore` 파일 생성**:

```
target/
.env
*.log
.idea/
*.iml
.DS_Store
```

**`application.yml` 설정** (`src/main/resources/`):

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/cafe_kiosk?useSSL=false&serverTimezone=Asia/Seoul
    username: ${DB_USERNAME}
    password: ${DB_PASSWORD}
    driver-class-name: com.mysql.cj.jdbc.Driver

  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
    properties:
      hibernate:
        format_sql: true
        dialect: org.hibernate.dialect.MySQLDialect

  thymeleaf:
    cache: false
    prefix: classpath:/templates/
    suffix: .html

server:
  port: 8080

logging:
  level:
    org.hibernate.SQL: DEBUG
```

---

#### 1.3 MySQL 데이터베이스 생성

```sql
CREATE DATABASE cafe_kiosk CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

---

#### 1.4 `pom.xml`에 추가 의존성

```xml
<!-- 추가 의존성 -->
<dependency>
    <groupId>me.paulschwarz</groupId>
    <artifactId>spring-dotenv</artifactId>
    <version>4.0.0</version>
</dependency>

<dependency>
    <groupId>org.webjars</groupId>
    <artifactId>bootstrap</artifactId>
    <version>5.3.2</version>
</dependency>

<dependency>
    <groupId>org.webjars</groupId>
    <artifactId>webjars-locator</artifactId>
    <version>0.52</version>
</dependency>
```

---

### 2단계: 데이터베이스 계층 (팀원 1)

#### 2.1 OrderStatus.java (Enum)

```java
package com.cafekiosk.model;

public enum OrderStatus {
    PENDING,      // 대기 중
    PREPARING,    // 준비 중
    READY,        // 준비 완료
    COMPLETED     // 픽업 완료
}
```

---

#### 2.2 Category.java

```java
package com.cafekiosk.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "categories")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String name;

    @Column(length = 200)
    private String description;

    @Column(name = "display_order")
    private Integer displayOrder = 0;

    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL)
    @ToString.Exclude
    @Builder.Default
    private List<MenuItem> menuItems = new ArrayList<>();

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
```

---

#### 2.3 MenuItem.java

```java
package com.cafekiosk.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "menu_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MenuItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(length = 500)
    private String description;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(name = "image_url", length = 300)
    private String imageUrl;

    @Column(nullable = false)
    @Builder.Default
    private Boolean available = true;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
```

---

#### 2.4 Order.java

```java
package com.cafekiosk.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "order_number", nullable = false, unique = true, length = 20)
    private String orderNumber;

    @Column(name = "customer_name", length = 100)
    private String customerName;

    @Column(name = "total_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalAmount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private OrderStatus status;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<OrderItem> orderItems = new ArrayList<>();

    @Column(name = "ordered_at")
    private LocalDateTime orderedAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        orderedAt = LocalDateTime.now();
        if (status == null) {
            status = OrderStatus.PENDING;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
        if (status == OrderStatus.COMPLETED && completedAt == null) {
            completedAt = LocalDateTime.now();
        }
    }
}
```

---

#### 2.5 OrderItem.java

```java
package com.cafekiosk.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "order_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    @ToString.Exclude
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "menu_item_id", nullable = false)
    private MenuItem menuItem;

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal subtotal;

    // 소계 계산 헬퍼 메서드
    public void calculateSubtotal() {
        if (price != null && quantity != null) {
            this.subtotal = price.multiply(BigDecimal.valueOf(quantity));
        }
    }
}
```

---

#### 2.6 Repository 인터페이스

**CategoryRepository.java:**

```java
package com.cafekiosk.repository;

import com.cafekiosk.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    List<Category> findAllByOrderByDisplayOrderAsc();
}
```

**MenuItemRepository.java:**

```java
package com.cafekiosk.repository;

import com.cafekiosk.model.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {

    // 카테고리별 사용 가능한 메뉴 조회
    List<MenuItem> findByCategoryIdAndAvailableTrue(Long categoryId);

    // 모든 사용 가능한 메뉴 조회
    List<MenuItem> findByAvailableTrue();
}
```

**OrderRepository.java:**

```java
package com.cafekiosk.repository;

import com.cafekiosk.model.Order;
import com.cafekiosk.model.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    Optional<Order> findByOrderNumber(String orderNumber);

    List<Order> findByStatusOrderByOrderedAtAsc(OrderStatus status);
}
```

---

### 3단계: 비즈니스 로직 (팀원 2)

#### 3.1 CartItem.java (DTO)

```java
package com.cafekiosk.dto;

import lombok.*;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartItem {

    private Long menuItemId;
    private String menuItemName;
    private BigDecimal price;
    private Integer quantity;
    private BigDecimal subtotal;

    // 소계 계산
    public void calculateSubtotal() {
        if (price != null && quantity != null) {
            this.subtotal = price.multiply(BigDecimal.valueOf(quantity));
        }
    }
}
```

---

#### 3.2 OrderRequest.java (DTO)

```java
package com.cafekiosk.dto;

import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderRequest {

    private String customerName;
    private List<CartItem> items;
}
```

---

#### 3.3 OrderResponse.java (DTO)

```java
package com.cafekiosk.dto;

import com.cafekiosk.model.OrderStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderResponse {

    private Long id;
    private String orderNumber;
    private String customerName;
    private BigDecimal totalAmount;
    private OrderStatus status;
    private List<CartItem> items;
    private LocalDateTime orderedAt;
}
```

---

#### 3.4 MenuService.java

```java
package com.cafekiosk.service;

import com.cafekiosk.model.Category;
import com.cafekiosk.model.MenuItem;
import com.cafekiosk.repository.CategoryRepository;
import com.cafekiosk.repository.MenuItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MenuService {

    private final CategoryRepository categoryRepository;
    private final MenuItemRepository menuItemRepository;

    // 모든 카테고리 조회
    public List<Category> getAllCategories() {
        return categoryRepository.findAllByOrderByDisplayOrderAsc();
    }

    // 모든 사용 가능한 메뉴 조회
    public List<MenuItem> getAllAvailableMenuItems() {
        return menuItemRepository.findByAvailableTrue();
    }

    // 카테고리별 메뉴 조회
    public List<MenuItem> getMenuItemsByCategory(Long categoryId) {
        return menuItemRepository.findByCategoryIdAndAvailableTrue(categoryId);
    }

    // 메뉴 ID로 조회
    public MenuItem getMenuItemById(Long id) {
        return menuItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("메뉴를 찾을 수 없습니다: " + id));
    }
}
```

---

#### 3.5 CartService.java

```java
package com.cafekiosk.service;

import com.cafekiosk.dto.CartItem;
import com.cafekiosk.model.MenuItem;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CartService {

    private static final String CART_SESSION_KEY = "cart";

    private final MenuService menuService;

    // 장바구니 조회
    @SuppressWarnings("unchecked")
    public List<CartItem> getCart(HttpSession session) {
        List<CartItem> cart = (List<CartItem>) session.getAttribute(CART_SESSION_KEY);
        if (cart == null) {
            cart = new ArrayList<>();
            session.setAttribute(CART_SESSION_KEY, cart);
        }
        return cart;
    }

    // 장바구니에 항목 추가
    public void addToCart(HttpSession session, Long menuItemId, Integer quantity) {
        MenuItem menuItem = menuService.getMenuItemById(menuItemId);
        List<CartItem> cart = getCart(session);

        // 이미 장바구니에 있는지 확인
        CartItem existingItem = cart.stream()
                .filter(item -> item.getMenuItemId().equals(menuItemId))
                .findFirst()
                .orElse(null);

        if (existingItem != null) {
            // 수량 증가
            existingItem.setQuantity(existingItem.getQuantity() + quantity);
            existingItem.calculateSubtotal();
        } else {
            // 새 항목 추가
            CartItem newItem = CartItem.builder()
                    .menuItemId(menuItem.getId())
                    .menuItemName(menuItem.getName())
                    .price(menuItem.getPrice())
                    .quantity(quantity)
                    .build();
            newItem.calculateSubtotal();
            cart.add(newItem);
        }
    }

    // 장바구니에서 항목 제거
    public void removeFromCart(HttpSession session, Long menuItemId) {
        List<CartItem> cart = getCart(session);
        cart.removeIf(item -> item.getMenuItemId().equals(menuItemId));
    }

    // 장바구니 비우기
    public void clearCart(HttpSession session) {
        session.removeAttribute(CART_SESSION_KEY);
    }

    // 장바구니 총액 계산
    public java.math.BigDecimal getCartTotal(HttpSession session) {
        List<CartItem> cart = getCart(session);
        return cart.stream()
                .map(CartItem::getSubtotal)
                .reduce(java.math.BigDecimal.ZERO, java.math.BigDecimal::add);
    }
}
```

---

#### 3.6 OrderService.java

```java
package com.cafekiosk.service;

import com.cafekiosk.dto.CartItem;
import com.cafekiosk.dto.OrderRequest;
import com.cafekiosk.dto.OrderResponse;
import com.cafekiosk.model.*;
import com.cafekiosk.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderService {

    private final OrderRepository orderRepository;
    private final MenuService menuService;

    // 주문 생성
    public OrderResponse createOrder(OrderRequest request) {
        // 주문 번호 생성 (예: ORD-20250107-001)
        String orderNumber = generateOrderNumber();

        // 총액 계산
        BigDecimal totalAmount = request.getItems().stream()
                .map(CartItem::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // 주문 엔티티 생성
        Order order = Order.builder()
                .orderNumber(orderNumber)
                .customerName(request.getCustomerName())
                .totalAmount(totalAmount)
                .status(OrderStatus.PENDING)
                .build();

        // 주문 항목 추가
        for (CartItem cartItem : request.getItems()) {
            MenuItem menuItem = menuService.getMenuItemById(cartItem.getMenuItemId());

            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .menuItem(menuItem)
                    .quantity(cartItem.getQuantity())
                    .price(cartItem.getPrice())
                    .build();
            orderItem.calculateSubtotal();

            order.getOrderItems().add(orderItem);
        }

        // 저장
        Order savedOrder = orderRepository.save(order);

        // 응답 DTO 변환
        return convertToResponse(savedOrder);
    }

    // 주문 조회
    @Transactional(readOnly = true)
    public OrderResponse getOrderByNumber(String orderNumber) {
        Order order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new RuntimeException("주문을 찾을 수 없습니다: " + orderNumber));
        return convertToResponse(order);
    }

    // 대기 중인 주문 목록
    @Transactional(readOnly = true)
    public List<OrderResponse> getPendingOrders() {
        return orderRepository.findByStatusOrderByOrderedAtAsc(OrderStatus.PENDING)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    // 주문 번호 생성
    private String generateOrderNumber() {
        String dateStr = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        long count = orderRepository.count() + 1;
        return String.format("ORD-%s-%03d", dateStr, count);
    }

    // Order → OrderResponse 변환
    private OrderResponse convertToResponse(Order order) {
        List<CartItem> items = order.getOrderItems().stream()
                .map(orderItem -> CartItem.builder()
                        .menuItemId(orderItem.getMenuItem().getId())
                        .menuItemName(orderItem.getMenuItem().getName())
                        .price(orderItem.getPrice())
                        .quantity(orderItem.getQuantity())
                        .subtotal(orderItem.getSubtotal())
                        .build())
                .collect(Collectors.toList());

        return OrderResponse.builder()
                .id(order.getId())
                .orderNumber(order.getOrderNumber())
                .customerName(order.getCustomerName())
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus())
                .items(items)
                .orderedAt(order.getOrderedAt())
                .build();
    }
}
```

---

### 4단계: 컨트롤러 (팀원 3)

#### 4.1 HomeController.java

```java
package com.cafekiosk.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    @GetMapping("/")
    public String home() {
        return "redirect:/menu";
    }
}
```

---

#### 4.2 MenuController.java

```java
package com.cafekiosk.controller;

import com.cafekiosk.model.Category;
import com.cafekiosk.model.MenuItem;
import com.cafekiosk.service.MenuService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/menu")
@RequiredArgsConstructor
public class MenuController {

    private final MenuService menuService;

    @GetMapping
    public String viewMenu(
            @RequestParam(required = false) Long categoryId,
            Model model) {

        List<Category> categories = menuService.getAllCategories();
        List<MenuItem> menuItems;

        if (categoryId != null) {
            menuItems = menuService.getMenuItemsByCategory(categoryId);
        } else {
            menuItems = menuService.getAllAvailableMenuItems();
        }

        model.addAttribute("categories", categories);
        model.addAttribute("menuItems", menuItems);
        model.addAttribute("selectedCategoryId", categoryId);

        return "menu";
    }
}
```

---

#### 4.3 CartController.java

```java
package com.cafekiosk.controller;

import com.cafekiosk.dto.CartItem;
import com.cafekiosk.service.CartService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@Controller
@RequestMapping("/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping
    public String viewCart(HttpSession session, Model model) {
        List<CartItem> cart = cartService.getCart(session);
        BigDecimal total = cartService.getCartTotal(session);

        model.addAttribute("cartItems", cart);
        model.addAttribute("cartTotal", total);

        return "cart";
    }

    @PostMapping("/add")
    public String addToCart(
            @RequestParam Long menuItemId,
            @RequestParam(defaultValue = "1") Integer quantity,
            HttpSession session) {

        cartService.addToCart(session, menuItemId, quantity);
        return "redirect:/menu";
    }

    @PostMapping("/remove/{menuItemId}")
    public String removeFromCart(
            @PathVariable Long menuItemId,
            HttpSession session) {

        cartService.removeFromCart(session, menuItemId);
        return "redirect:/cart";
    }

    @PostMapping("/clear")
    public String clearCart(HttpSession session) {
        cartService.clearCart(session);
        return "redirect:/cart";
    }
}
```

---

#### 4.4 OrderController.java

```java
package com.cafekiosk.controller;

import com.cafekiosk.dto.CartItem;
import com.cafekiosk.dto.OrderRequest;
import com.cafekiosk.dto.OrderResponse;
import com.cafekiosk.service.CartService;
import com.cafekiosk.service.OrderService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/order")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final CartService cartService;

    @PostMapping("/checkout")
    public String checkout(
            @RequestParam(required = false) String customerName,
            HttpSession session,
            Model model) {

        List<CartItem> cart = cartService.getCart(session);

        if (cart.isEmpty()) {
            return "redirect:/cart";
        }

        // 주문 생성
        OrderRequest request = OrderRequest.builder()
                .customerName(customerName)
                .items(cart)
                .build();

        OrderResponse order = orderService.createOrder(request);

        // 장바구니 비우기
        cartService.clearCart(session);

        // 주문 완료 페이지로
        model.addAttribute("order", order);
        return "order-complete";
    }

    @GetMapping("/{orderNumber}")
    public String viewOrder(@PathVariable String orderNumber, Model model) {
        OrderResponse order = orderService.getOrderByNumber(orderNumber);
        model.addAttribute("order", order);
        return "order-complete";
    }
}
```

---

#### 4.5 GlobalExceptionHandler.java

```java
package com.cafekiosk.exception;

import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public String handleNotFound(ResourceNotFoundException ex, Model model) {
        model.addAttribute("error", ex.getMessage());
        return "error/404";
    }

    @ExceptionHandler(Exception.class)
    public String handleException(Exception ex, Model model) {
        model.addAttribute("error", "오류가 발생했습니다: " + ex.getMessage());
        return "error/500";
    }
}
```

---

#### 4.6 ResourceNotFoundException.java

```java
package com.cafekiosk.exception;

public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
```

#### 5.6 kiosk.js

```javascript
// src/main/resources/static/js/kiosk.js

document.addEventListener("DOMContentLoaded", function () {
  console.log("Cafe Kiosk initialized");

  // 수량 증가/감소 버튼 (필요시 추가)
  const quantityInputs = document.querySelectorAll('input[name="quantity"]');

  quantityInputs.forEach((input) => {
    input.addEventListener("change", function () {
      if (this.value < 1) this.value = 1;
      if (this.value > 99) this.value = 99;
    });
  });

  // 폼 제출 확인
  const checkoutForm = document.querySelector(
    'form[action*="/order/checkout"]'
  );
  if (checkoutForm) {
    checkoutForm.addEventListener("submit", function (e) {
      if (!confirm("주문을 진행하시겠습니까?")) {
        e.preventDefault();
      }
    });
  }
});
```

---

### 6단계: 샘플 데이터 (data.sql)

**`src/main/resources/data.sql`:**

```sql
-- 카테고리
INSERT INTO categories (id, name, description, display_order, created_at) VALUES
(1, '커피', '신선한 원두로 만든 커피', 1, NOW()),
(2, '디저트', '달콤한 디저트', 2, NOW()),
(3, '음료', '시원한 음료', 3, NOW())
ON DUPLICATE KEY UPDATE name=name;

-- 메뉴 항목
INSERT INTO menu_items (id, name, description, price, image_url, available, category_id, created_at, updated_at) VALUES
-- 커피
(1, '아메리카노', '깔끔한 에스프레소와 물', 3000.00, 'https://via.placeholder.com/300?text=Americano', TRUE, 1, NOW(), NOW()),
(2, '카페라떼', '부드러운 우유와 에스프레소', 3500.00, 'https://via.placeholder.com/300?text=Latte', TRUE, 1, NOW(), NOW()),
(3, '카푸치노', '풍성한 거품과 에스프레소', 3500.00, 'https://via.placeholder.com/300?text=Cappuccino', TRUE, 1, NOW(), NOW()),
(4, '바닐라 라떼', '달콤한 바닐라 시럽과 우유', 4000.00, 'https://via.placeholder.com/300?text=Vanilla+Latte', TRUE, 1, NOW(), NOW()),

-- 디저트
(5, '초콜릿 케이크', '진한 초콜릿 케이크', 5000.00, 'https://via.placeholder.com/300?text=Choco+Cake', TRUE, 2, NOW(), NOW()),
(6, '치즈케이크', '부드러운 뉴욕 스타일', 5500.00, 'https://via.placeholder.com/300?text=Cheesecake', TRUE, 2, NOW(), NOW()),
(7, '크루아상', '바삭한 버터 크루아상', 3000.00, 'https://via.placeholder.com/300?text=Croissant', TRUE, 2, NOW(), NOW()),
(8, '마카롱', '달콤한 프랑스 마카롱', 2000.00, 'https://via.placeholder.com/300?text=Macaron', TRUE, 2, NOW(), NOW()),

-- 음료
(9, '오렌지 주스', '신선한 오렌지 주스', 4000.00, 'https://via.placeholder.com/300?text=Orange+Juice', TRUE, 3, NOW(), NOW()),
(10, '딸기 스무디', '달콤한 딸기 스무디', 4500.00, 'https://via.placeholder.com/300?text=Strawberry+Smoothie', TRUE, 3, NOW(), NOW()),
(11, '녹차 라떼', '고소한 녹차 라떼', 4000.00, 'https://via.placeholder.com/300?text=Green+Tea+Latte', TRUE, 3, NOW(), NOW())
ON DUPLICATE KEY UPDATE name=name;
```

---

## 주차별 일정

### 1주차: 환경 설정 및 데이터베이스

- **Day 1**: 프로젝트 초기화, MySQL 설정
- **Day 2-3**: Entity + Repository 작성 (팀원 1)
- **Day 4**: Repository 테스트 작성
- **Day 5**: 중간 점검

### 2주차: 비즈니스 로직

- **Day 6-7**: DTO 작성 (팀원 2)
- **Day 8-9**: Service 작성 (팀원 2)
- **Day 10**: Service 테스트 작성

### 3주차: 백엔드 완성

- **Day 11-12**: Controller 작성 (팀원 3)
- **Day 13**: Exception Handler 작성 (팀원 3)
- **Day 14**: Postman으로 API 테스트
- **Day 15**: 중간 점검

### 4주차: 프론트엔드

- **Day 16-17**: layout.html, menu.html (팀원 4)
- **Day 18**: cart.html (팀원 4)
- **Day 19**: order-complete.html (팀원 4)
- **Day 20**: CSS/JS 작성

### 5주차: 통합 및 테스트

- **Day 21-22**: 전체 통합 테스트
- **Day 23**: 버그 수정
- **Day 24**: UI 개선
- **Day 25**: 최종 점검

### 6주차: 발표 준비

- **Day 26-27**: README 작성, 문서 정리
- **Day 28**: 발표 자료 준비
- **Day 29**: 시연 연습
- **Day 30**: 최종 발표

---

## 실행 방법

### 1. MySQL 데이터베이스 생성

```sql
CREATE DATABASE cafe_kiosk CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. 환경 변수 설정

`.env` 파일 생성:

```properties
DB_USERNAME=root
DB_PASSWORD=your_password
```

### 3. 애플리케이션 실행

```bash
mvn spring-boot:run
```

### 4. 브라우저 접속

```
http://localhost:8080
```

---

## 테스트 시나리오

### 기본 흐름

1. ✅ 메뉴 페이지 접속
2. ✅ 카테고리 필터링
3. ✅ 장바구니에 항목 추가
4. ✅ 장바구니 확인
5. ✅ 주문하기
6. ✅ 주문 완료 확인

### 엣지 케이스

- ❌ 빈 장바구니로 주문 시도
- ❌ 수량 0 또는 음수
- ❌ 존재하지 않는 메뉴 ID

---

## 팀원별 체크리스트

### ✅ 팀원 1 (Database)

- [ ] OrderStatus enum 작성
- [ ] Category entity 작성
- [ ] MenuItem entity 작성
- [ ] Order entity 작성
- [ ] OrderItem entity 작성
- [ ] CategoryRepository 작성
- [ ] MenuItemRepository 작성
- [ ] OrderRepository 작성
- [ ] Repository 테스트 작성

### ✅ 팀원 2 (Business Logic)

- [ ] CartItem DTO 작성
- [ ] OrderRequest DTO 작성
- [ ] OrderResponse DTO 작성
- [ ] MenuService 작성
- [ ] CartService 작성
- [ ] OrderService 작성
- [ ] Service 테스트 작성

### ✅ 팀원 3 (Controllers)

- [ ] HomeController 작성
- [ ] MenuController 작성
- [ ] CartController 작성
- [ ] OrderController 작성
- [ ] GlobalExceptionHandler 작성
- [ ] ResourceNotFoundException 작성
- [ ] Postman 테스트 완료

---

## 추가 기능 아이디어 (선택사항)

### 난이도: 하

- [ ] 주문 번호로 주문 조회 페이지
- [ ] 인기 메뉴 표시 (주문 횟수 기반)
- [ ] 메뉴 이미지 업로드 기능

### 난이도: 중

- [ ] 주문 상태 변경 (PENDING → READY)
- [ ] 간단한 관리자 페이지 (주문 목록)
- [ ] 날짜별 매출 통계

### 난이도: 상

- [ ] 실시간 주문 알림 (WebSocket)
- [ ] 카카오페이/토스페이 연동
- [ ] 회원 시스템 추가

---

## 자주 묻는 질문 (FAQ)

**Q: 이미지는 어떻게 추가하나요?**
A: `src/main/resources/static/images/menu/` 폴더에 이미지 파일을 넣고, `image_url` 컬럼에 `/images/menu/파일명.jpg` 형식으로 저장하세요.

**Q: 장바구니가 페이지를 새로고침하면 사라져요.**
A: 현재는 세션 기반이므로 세션이 만료되면 사라집니다. DB에 저장하려면 `CartItem` 테이블을 추가하세요.

**Q: 한국어가 깨져요.**
A: `application.yml`의 `datasource.url`에 `?characterEncoding=UTF-8`을 추가하세요.

**Q: Bootstrap이 안 나와요.**
A: `pom.xml`에 webjars 의존성이 있는지, `webjars-locator`가 추가되었는지 확인하세요.

---

## 마무리

이 가이드를 따라하면 **완전히 작동하는 카페 키오스크 시스템**을 만들 수 있습니다!

각 팀원은 자신의 역할에 집중하고, 주 1회 통합 회의를 통해 진행 상황을 공유하세요.

**화이팅! 🎉**

```

```
