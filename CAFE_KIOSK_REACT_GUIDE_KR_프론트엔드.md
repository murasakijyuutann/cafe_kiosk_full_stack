# 카페 키오스크 - React 프론트엔드 가이드

## 초보자를 위한 React + Spring Boot 연동 가이드

---

## 📚 목차

1. [프로젝트 개요](#프로젝트-개요)
2. [프로젝트 구조](#프로젝트-구조)
3. [백엔드 수정사항](#백엔드-수정사항)
4. [React 프로젝트 설정](#react-프로젝트-설정)
5. [React 컴포넌트](#react-컴포넌트)
6. [API 연동](#api-연동)
7. [상태 관리](#상태-관리)
8. [스타일링](#스타일링)
9. [배포](#배포)

---

## 프로젝트 개요

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

### 기술 스택

- **Frontend**: React 18 + Vite
- **Backend**: Spring Boot 3.5.6
- **HTTP Client**: Axios
- **Routing**: React Router v6
- **UI Framework**: Bootstrap 5
- **State Management**: React Context API (간단한 버전)

### 왜 React인가?

✅ 컴포넌트 재사용 가능
✅ 빠른 개발 속도
✅ 풍부한 생태계
✅ 취업 시장에서 인기
✅ SPA (Single Page Application) 경험

---

## 프로젝트 구조

### 전체 구조

```
cafe-kiosk/
├── backend/                           # Spring Boot 프로젝트
│   ├── src/main/java/com/cafekiosk/
│   │   ├── controller/                # REST API 컨트롤러
│   │   ├── service/
│   │   ├── model/
│   │   └── repository/
│   └── pom.xml
│
└── frontend/                          # React 프로젝트
    ├── public/
    │   └── images/
    │       └── menu/
    ├── src/
    │   ├── api/                       # API 호출 함수
    │   │   └── cafekioskApi.js
    │   ├── components/                # React 컴포넌트
    │   │   ├── common/
    │   │   │   ├── Header.jsx
    │   │   │   └── Footer.jsx
    │   │   ├── menu/
    │   │   │   ├── MenuList.jsx
    │   │   │   ├── MenuItem.jsx
    │   │   │   └── CategoryFilter.jsx
    │   │   ├── cart/
    │   │   │   ├── Cart.jsx
    │   │   │   └── CartItem.jsx
    │   │   └── order/
    │   │       └── OrderComplete.jsx
    │   ├── pages/                     # 페이지 컴포넌트
    │   │   ├── HomePage.jsx
    │   │   ├── MenuPage.jsx
    │   │   ├── CartPage.jsx
    │   │   └── OrderCompletePage.jsx
    │   ├── context/                   # Context API (상태 관리)
    │   │   └── CartContext.jsx
    │   ├── App.jsx                    # 메인 앱
    │   ├── main.jsx                   # 진입점
    │   └── App.css
    ├── package.json
    └── vite.config.js
```

---

## 백엔드 수정사항

React를 사용하려면 백엔드를 **REST API**로 변경해야 합니다.

### 1. CORS 설정 추가

**`WebConfig.java` 생성** (새로 만들기):

```java
package com.cafekiosk.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:5173")  // Vite 기본 포트
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
```

---

### 2. REST API 컨트롤러 생성

기존 컨트롤러를 REST API로 변경합니다.

#### **MenuApiController.java** (새로 만들기)

```java
package com.cafekiosk.controller;

import com.cafekiosk.model.Category;
import com.cafekiosk.model.MenuItem;
import com.cafekiosk.service.MenuService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/menu")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class MenuApiController {

    private final MenuService menuService;

    // 모든 카테고리 조회
    @GetMapping("/categories")
    public ResponseEntity<List<Category>> getCategories() {
        List<Category> categories = menuService.getAllCategories();
        return ResponseEntity.ok(categories);
    }

    // 모든 메뉴 조회
    @GetMapping("/items")
    public ResponseEntity<List<MenuItem>> getAllMenuItems() {
        List<MenuItem> items = menuService.getAllAvailableMenuItems();
        return ResponseEntity.ok(items);
    }

    // 카테고리별 메뉴 조회
    @GetMapping("/items/category/{categoryId}")
    public ResponseEntity<List<MenuItem>> getMenuItemsByCategory(
            @PathVariable Long categoryId) {
        List<MenuItem> items = menuService.getMenuItemsByCategory(categoryId);
        return ResponseEntity.ok(items);
    }

    // 특정 메뉴 조회
    @GetMapping("/items/{id}")
    public ResponseEntity<MenuItem> getMenuItem(@PathVariable Long id) {
        MenuItem item = menuService.getMenuItemById(id);
        return ResponseEntity.ok(item);
    }
}
```

---

#### **OrderApiController.java** (새로 만들기)

```java
package com.cafekiosk.controller;

import com.cafekiosk.dto.OrderRequest;
import com.cafekiosk.dto.OrderResponse;
import com.cafekiosk.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class OrderApiController {

    private final OrderService orderService;

    // 주문 생성
    @PostMapping
    public ResponseEntity<OrderResponse> createOrder(@RequestBody OrderRequest request) {
        OrderResponse order = orderService.createOrder(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(order);
    }

    // 주문 조회
    @GetMapping("/{orderNumber}")
    public ResponseEntity<OrderResponse> getOrder(@PathVariable String orderNumber) {
        OrderResponse order = orderService.getOrderByNumber(orderNumber);
        return ResponseEntity.ok(order);
    }
}
```

---

### 3. Entity JSON 직렬화 수정

**Category.java와 MenuItem.java 수정**:

```java
// Category.java
import com.fasterxml.jackson.annotation.JsonManagedReference;

@OneToMany(mappedBy = "category", cascade = CascadeType.ALL)
@ToString.Exclude
@JsonManagedReference  // 추가
@Builder.Default
private List<MenuItem> menuItems = new ArrayList<>();
```

```java
// MenuItem.java
import com.fasterxml.jackson.annotation.JsonBackReference;

@ManyToOne(fetch = FetchType.EAGER)  // LAZY → EAGER로 변경
@JoinColumn(name = "category_id", nullable = false)
@JsonBackReference  // 추가
private Category category;

// Category 정보만 반환하는 메서드 추가
@JsonProperty("categoryName")
public String getCategoryName() {
    return category != null ? category.getName() : null;
}

@JsonProperty("categoryId")
public Long getCategoryId() {
    return category != null ? category.getId() : null;
}
```

---

## React 프로젝트 설정

### 1. Vite로 React 프로젝트 생성

터미널에서 실행:

```bash
# cafe-kiosk 폴더로 이동
cd cafe-kiosk

# React 프로젝트 생성
npm create vite@latest frontend -- --template react

# 프로젝트 폴더로 이동
cd frontend

# 의존성 설치
npm install
```

---

### 2. 필요한 패키지 설치

```bash
npm install axios react-router-dom bootstrap
```

**패키지 설명:**

- `axios`: HTTP 요청 (API 호출)
- `react-router-dom`: 페이지 라우팅
- `bootstrap`: UI 스타일링

---

### 3. `package.json` 확인

```json
{
  "name": "cafe-kiosk-frontend",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "axios": "^1.6.0",
    "bootstrap": "^5.3.2",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.2.0",
    "vite": "^5.0.0"
  }
}
```

---

### 4. `vite.config.js` 설정

```javascript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
});
```

**설명:**

- React 개발 서버: `http://localhost:5173`
- Spring Boot API: `http://localhost:8080`
- `/api/*` 요청은 자동으로 Spring Boot로 프록시

---

## React 컴포넌트

### 1. API 호출 함수 (`src/api/cafekioskApi.js`)

```javascript
import axios from "axios";

const API_BASE_URL = "/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 카테고리 API
export const getCategories = async () => {
  const response = await api.get("/menu/categories");
  return response.data;
};

// 메뉴 API
export const getAllMenuItems = async () => {
  const response = await api.get("/menu/items");
  return response.data;
};

export const getMenuItemsByCategory = async (categoryId) => {
  const response = await api.get(`/menu/items/category/${categoryId}`);
  return response.data;
};

export const getMenuItemById = async (id) => {
  const response = await api.get(`/menu/items/${id}`);
  return response.data;
};

// 주문 API
export const createOrder = async (orderData) => {
  const response = await api.post("/orders", orderData);
  return response.data;
};

export const getOrderByNumber = async (orderNumber) => {
  const response = await api.get(`/orders/${orderNumber}`);
  return response.data;
};

export default api;
```

---

### 2. Cart Context (`src/context/CartContext.jsx`)

장바구니 상태를 전역으로 관리합니다.

```javascript
import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    // localStorage에서 장바구니 복원
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // 장바구니 변경 시 localStorage에 저장
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // 장바구니에 추가
  const addToCart = (menuItem, quantity = 1) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.menuItemId === menuItem.id
      );

      if (existingItem) {
        // 기존 항목 수량 증가
        return prevCart.map((item) =>
          item.menuItemId === menuItem.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // 새 항목 추가
        return [
          ...prevCart,
          {
            menuItemId: menuItem.id,
            menuItemName: menuItem.name,
            price: menuItem.price,
            quantity: quantity,
            subtotal: menuItem.price * quantity,
          },
        ];
      }
    });
  };

  // 장바구니에서 제거
  const removeFromCart = (menuItemId) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.menuItemId !== menuItemId)
    );
  };

  // 수량 업데이트
  const updateQuantity = (menuItemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(menuItemId);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.menuItemId === menuItemId
          ? { ...item, quantity, subtotal: item.price * quantity }
          : item
      )
    );
  };

  // 장바구니 비우기
  const clearCart = () => {
    setCart([]);
  };

  // 총액 계산
  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.subtotal, 0);
  };

  // 총 개수 계산
  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
```

---

### 3. Header 컴포넌트 (`src/components/common/Header.jsx`)

```javascript
import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";

const Header = () => {
  const { getCartCount } = useCart();
  const cartCount = getCartCount();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">
          ☕ Cafe Kiosk
        </Link>
        <div className="navbar-nav ms-auto">
          <Link className="nav-link" to="/menu">
            메뉴
          </Link>
          <Link className="nav-link position-relative" to="/cart">
            🛒 장바구니
            {cartCount > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Header;
```

---

### 4. Footer 컴포넌트 (`src/components/common/Footer.jsx`)

```javascript
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-dark text-white text-center py-3 mt-auto">
      <p className="mb-0">&copy; 2025 Cafe Kiosk. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
```

---

### 5. CategoryFilter 컴포넌트 (`src/components/menu/CategoryFilter.jsx`)

```javascript
import React from "react";

const CategoryFilter = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
}) => {
  return (
    <div className="btn-group mb-4" role="group">
      <button
        type="button"
        className={`btn btn-outline-primary ${
          selectedCategoryId === null ? "active" : ""
        }`}
        onClick={() => onSelectCategory(null)}
      >
        전체
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          type="button"
          className={`btn btn-outline-primary ${
            selectedCategoryId === category.id ? "active" : ""
          }`}
          onClick={() => onSelectCategory(category.id)}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
```

---

### 6. MenuItem 컴포넌트 (`src/components/menu/MenuItem.jsx`)

```javascript
import React, { useState } from "react";
import { useCart } from "../../context/CartContext";

const MenuItem = ({ item }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    addToCart(item, quantity);
    alert(`${item.name} ${quantity}개가 장바구니에 추가되었습니다!`);
    setQuantity(1);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("ko-KR").format(price);
  };

  return (
    <div className="col">
      <div className="card h-100 shadow-sm hover-card">
        <img
          src={item.imageUrl || "https://via.placeholder.com/300?text=No+Image"}
          className="card-img-top"
          alt={item.name}
          style={{ height: "200px", objectFit: "cover" }}
        />
        <div className="card-body">
          <h5 className="card-title">{item.name}</h5>
          <p className="card-text text-muted">{item.description}</p>
          <p className="card-text">
            <strong className="text-primary fs-5">
              {formatPrice(item.price)}원
            </strong>
          </p>
        </div>
        <div className="card-footer bg-transparent">
          <div className="d-flex gap-2">
            <input
              type="number"
              className="form-control"
              value={quantity}
              onChange={(e) =>
                setQuantity(Math.max(1, parseInt(e.target.value) || 1))
              }
              min="1"
              max="99"
              style={{ width: "80px" }}
            />
            <button
              className="btn btn-primary flex-grow-1"
              onClick={handleAddToCart}
            >
              장바구니 담기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuItem;
```

---

### 7. MenuList 컴포넌트 (`src/components/menu/MenuList.jsx`)

```javascript
import React from "react";
import MenuItem from "./MenuItem";

const MenuList = ({ menuItems }) => {
  if (!menuItems || menuItems.length === 0) {
    return (
      <div className="alert alert-info">해당 카테고리에 메뉴가 없습니다.</div>
    );
  }

  return (
    <div className="row row-cols-1 row-cols-md-3 g-4">
      {menuItems.map((item) => (
        <MenuItem key={item.id} item={item} />
      ))}
    </div>
  );
};

export default MenuList;
```

---

### 8. CartItem 컴포넌트 (`src/components/cart/CartItem.jsx`)

```javascript
import React from "react";
import { useCart } from "../../context/CartContext";

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  const formatPrice = (price) => {
    return new Intl.NumberFormat("ko-KR").format(price);
  };

  return (
    <tr>
      <td>{item.menuItemName}</td>
      <td>{formatPrice(item.price)}원</td>
      <td>
        <input
          type="number"
          className="form-control"
          value={item.quantity}
          onChange={(e) =>
            updateQuantity(item.menuItemId, parseInt(e.target.value) || 0)
          }
          min="1"
          max="99"
          style={{ width: "80px" }}
        />
      </td>
      <td>{formatPrice(item.subtotal)}원</td>
      <td>
        <button
          className="btn btn-sm btn-danger"
          onClick={() => removeFromCart(item.menuItemId)}
        >
          삭제
        </button>
      </td>
    </tr>
  );
};

export default CartItem;
```

---

### 9. Cart 컴포넌트 (`src/components/cart/Cart.jsx`)

```javascript
import React from "react";
import { useCart } from "../../context/CartContext";
import CartItem from "./CartItem";

const Cart = () => {
  const { cart, getCartTotal } = useCart();

  const formatPrice = (price) => {
    return new Intl.NumberFormat("ko-KR").format(price);
  };

  if (cart.length === 0) {
    return null;
  }

  return (
    <table className="table">
      <thead>
        <tr>
          <th>메뉴</th>
          <th>가격</th>
          <th>수량</th>
          <th>소계</th>
          <th>삭제</th>
        </tr>
      </thead>
      <tbody>
        {cart.map((item) => (
          <CartItem key={item.menuItemId} item={item} />
        ))}
      </tbody>
      <tfoot>
        <tr>
          <td colSpan="3" className="text-end">
            <strong>총액:</strong>
          </td>
          <td colSpan="2">
            <strong className="text-primary fs-5">
              {formatPrice(getCartTotal())}원
            </strong>
          </td>
        </tr>
      </tfoot>
    </table>
  );
};

export default Cart;
```

---

### 10. OrderComplete 컴포넌트 (`src/components/order/OrderComplete.jsx`)

```javascript
import React from "react";
import { Link } from "react-router-dom";

const OrderComplete = ({ order }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat("ko-KR").format(price);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="text-center">
      <div className="mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="100"
          height="100"
          fill="currentColor"
          className="bi bi-check-circle text-success"
          viewBox="0 0 16 16"
        >
          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
          <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z" />
        </svg>
      </div>

      <h1 className="mb-3">주문이 완료되었습니다!</h1>

      <div className="alert alert-info d-inline-block">
        <h4 className="mb-0">주문번호: {order.orderNumber}</h4>
      </div>

      {/* 주문 상세 */}
      <div className="card mt-4 text-start">
        <div className="card-header">
          <h5 className="mb-0">주문 상세</h5>
        </div>
        <div className="card-body">
          {order.customerName && (
            <div className="mb-3">
              <strong>주문자:</strong> {order.customerName}
            </div>
          )}

          <div className="mb-3">
            <strong>주문 시간:</strong> {formatDate(order.orderedAt)}
          </div>

          <div className="mb-3">
            <strong>상태:</strong>{" "}
            <span className="badge bg-warning">{order.status}</span>
          </div>

          <hr />

          <h6>주문 항목</h6>
          <table className="table table-sm">
            <thead>
              <tr>
                <th>메뉴</th>
                <th>가격</th>
                <th>수량</th>
                <th>소계</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, index) => (
                <tr key={index}>
                  <td>{item.menuItemName}</td>
                  <td>{formatPrice(item.price)}원</td>
                  <td>{item.quantity}</td>
                  <td>{formatPrice(item.subtotal)}원</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="3" className="text-end">
                  <strong>총액:</strong>
                </td>
                <td>
                  <strong className="text-primary">
                    {formatPrice(order.totalAmount)}원
                  </strong>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* 버튼 */}
      <div className="mt-4">
        <Link to="/menu" className="btn btn-primary btn-lg">
          메뉴로 돌아가기
        </Link>
      </div>
    </div>
  );
};

export default OrderComplete;
```

---

## 페이지 컴포넌트

### 1. HomePage (`src/pages/HomePage.jsx`)

```javascript
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // 홈페이지 접속 시 메뉴로 리다이렉트
    navigate("/menu");
  }, [navigate]);

  return (
    <div className="text-center">
      <h1>로딩 중...</h1>
    </div>
  );
};

export default HomePage;
```

---

### 2. MenuPage (`src/pages/MenuPage.jsx`)

```javascript
import React, { useState, useEffect } from "react";
import CategoryFilter from "../components/menu/CategoryFilter";
import MenuList from "../components/menu/MenuList";
import {
  getCategories,
  getAllMenuItems,
  getMenuItemsByCategory,
} from "../api/cafekioskApi";

const MenuPage = () => {
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 카테고리 로드
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        console.error("카테고리 로드 실패:", err);
        setError("카테고리를 불러올 수 없습니다.");
      }
    };

    fetchCategories();
  }, []);

  // 메뉴 로드
  useEffect(() => {
    const fetchMenuItems = async () => {
      setLoading(true);
      setError(null);

      try {
        let data;
        if (selectedCategoryId === null) {
          data = await getAllMenuItems();
        } else {
          data = await getMenuItemsByCategory(selectedCategoryId);
        }
        setMenuItems(data);
      } catch (err) {
        console.error("메뉴 로드 실패:", err);
        setError("메뉴를 불러올 수 없습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, [selectedCategoryId]);

  const handleSelectCategory = (categoryId) => {
    setSelectedCategoryId(categoryId);
  };

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div>
      <h1 className="mb-4">메뉴</h1>

      <CategoryFilter
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        onSelectCategory={handleSelectCategory}
      />

      {loading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">로딩 중...</span>
          </div>
        </div>
      ) : (
        <MenuList menuItems={menuItems} />
      )}
    </div>
  );
};

export default MenuPage;
```

---

### 3. CartPage (`src/pages/CartPage.jsx`)

```javascript
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import Cart from "../components/cart/Cart";
import { createOrder } from "../api/cafekioskApi";

const CartPage = () => {
  const { cart, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [customerName, setCustomerName] = useState("");
  const [loading, setLoading] = useState(false);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("ko-KR").format(price);
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert("장바구니가 비어 있습니다.");
      return;
    }

    if (!window.confirm("주문을 진행하시겠습니까?")) {
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        customerName: customerName || null,
        items: cart,
      };

      const order = await createOrder(orderData);

      // 장바구니 비우기
      clearCart();

      // 주문 완료 페이지로 이동
      navigate("/order-complete", { state: { order } });
    } catch (error) {
      console.error("주문 생성 실패:", error);
      alert("주문 처리 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div>
        <h1 className="mb-4">장바구니</h1>
        <div className="alert alert-warning">
          장바구니가 비어 있습니다.{" "}
          <a href="/menu" className="alert-link">
            메뉴로 이동
          </a>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-4">장바구니</h1>

      <Cart />

      {/* 주문 폼 */}
      <div className="card mt-4">
        <div className="card-body">
          <h5 className="card-title">주문하기</h5>
          <div className="mb-3">
            <label htmlFor="customerName" className="form-label">
              이름 (선택사항)
            </label>
            <input
              type="text"
              className="form-control"
              id="customerName"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="주문하실 분 이름을 입력하세요"
            />
          </div>
          <div className="d-flex gap-2">
            <button
              className="btn btn-primary flex-grow-1"
              onClick={handleCheckout}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                  ></span>
                  처리 중...
                </>
              ) : (
                `주문하기 (₩${formatPrice(getCartTotal())})`
              )}
            </button>
            <a href="/menu" className="btn btn-secondary">
              계속 쇼핑
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
```

---

### 4. OrderCompletePage (`src/pages/OrderCompletePage.jsx`)

```javascript
import React from "react";
import { useLocation, Navigate } from "react-router-dom";
import OrderComplete from "../components/order/OrderComplete";

const OrderCompletePage = () => {
  const location = useLocation();
  const order = location.state?.order;

  // 주문 데이터 없으면 홈으로 리다이렉트
  if (!order) {
    return <Navigate to="/" replace />;
  }

  return (
    <div>
      <OrderComplete order={order} />
    </div>
  );
};

export default OrderCompletePage;
```

---

## 메인 App 설정

### 1. `src/main.jsx`

```javascript
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

---

### 2. `src/App.jsx`

```javascript
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import HomePage from "./pages/HomePage";
import MenuPage from "./pages/MenuPage";
import CartPage from "./pages/CartPage";
import OrderCompletePage from "./pages/OrderCompletePage";

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="d-flex flex-column min-vh-100">
          <Header />

          <main className="container my-4 flex-grow-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/menu" element={<MenuPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/order-complete" element={<OrderCompletePage />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
```

---

### 3. `src/App.css`

```css
/* 카드 호버 효과 */
.hover-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.hover-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15) !important;
}

/* 스피너 */
.spinner-border-sm {
  width: 1rem;
  height: 1rem;
}

/* 레이아웃 */
.min-vh-100 {
  min-height: 100vh;
}

/* 장바구니 뱃지 */
.position-relative .badge {
  font-size: 0.65rem;
}

/* 반응형 */
@media (max-width: 768px) {
  .card-img-top {
    height: 150px !important;
  }

  h1 {
    font-size: 1.75rem;
  }
}
```

---

## 실행 방법

### 1. 백엔드 실행

```bash
# Spring Boot 프로젝트 폴더로 이동
cd backend

# Maven으로 실행
mvn spring-boot:run
```

백엔드 주소: `http://localhost:8080`

---

### 2. 프론트엔드 실행

새 터미널 창을 열어서:

```bash
# React 프로젝트 폴더로 이동
cd frontend

# 개발 서버 실행
npm run dev
```

프론트엔드 주소: `http://localhost:5173`

---

### 3. 브라우저 접속

```
http://localhost:5173
```

---

## 배포

### 프로덕션 빌드

```bash
# frontend 폴더에서
npm run build
```

빌드된 파일은 `frontend/dist/` 폴더에 생성됩니다.

### Spring Boot에 통합

빌드된 React 앱을 Spring Boot에 포함시키려면:

1. **`frontend/dist/` 내용을 `backend/src/main/resources/static/`로 복사**
2. **Spring Boot 실행**

이제 `http://localhost:8080`에서 React 앱이 서빙됩니다.

---

## 팀원별 작업 가이드

### 팀원 1: 백엔드 REST API

- [ ] `MenuApiController.java` 작성
- [ ] `OrderApiController.java` 작성
- [ ] `WebConfig.java` (CORS 설정)
- [ ] Entity JSON 직렬화 수정

**예상 시간:** 1-2일

---

### 팀원 2 & 3: React 컴포넌트

- [ ] API 함수 작성 (`cafekioskApi.js`)
- [ ] Context API (`CartContext.jsx`)
- [ ] 공통 컴포넌트 (Header, Footer)
- [ ] 메뉴 컴포넌트 (CategoryFilter, MenuItem, MenuList)
- [ ] 장바구니 컴포넌트 (Cart, CartItem)
- [ ] 주문 컴포넌트 (OrderComplete)

**예상 시간:** 3-4일

---

### 팀원 4: 페이지 & 스타일

- [ ] 페이지 컴포넌트 (HomePage, MenuPage, CartPage, OrderCompletePage)
- [ ] App.jsx 라우팅 설정
- [ ] CSS 스타일링
- [ ] 반응형 테스트

**예상 시간:** 2-3일

---

## 자주 묻는 질문

**Q: CORS 오류가 나요.**
A: `WebConfig.java`에서 `http://localhost:5173`이 허용되어 있는지 확인하세요.

**Q: API 호출이 안 돼요.**
A:

1. Spring Boot가 8080 포트에서 실행 중인지 확인
2. Vite proxy 설정이 되어 있는지 확인
3. 브라우저 개발자 도구 Network 탭에서 요청 확인

**Q: 장바구니가 새로고침하면 사라져요.**
A: CartContext에서 localStorage를 사용하고 있어서 새로고침해도 유지됩니다.

**Q: 이미지가 안 보여요.**
A: `data.sql`의 `image_url`이 올바른지 확인하세요. 또는 `public/images/menu/` 폴더에 이미지를 넣으세요.

---

## 추가 기능 아이디어

### 쉬움

- [ ] 로딩 스피너 개선
- [ ] 토스트 알림 (react-toastify)
- [ ] 다크 모드

### 보통

- [ ] 메뉴 검색 기능
- [ ] 주문 내역 페이지
- [ ] 메뉴 상세 모달

### 어려움

- [ ] 로그인/회원가입
- [ ] 관리자 페이지 (주문 관리)
- [ ] 실시간 주문 알림 (WebSocket)

---

## 학습 리소스

- **React 공식 문서**: https://react.dev/
- **React Router**: https://reactrouter.com/
- **Axios**: https://axios-http.com/
- **Bootstrap**: https://getbootstrap.com/

---

## 마무리

이 가이드를 따라하면 **React + Spring Boot 풀스택 카페 키오스크**를 만들 수 있습니다!

React를 사용하면 Thymeleaf보다 더 인터랙티브하고 현대적인 UI를 만들 수 있습니다.

**화이팅! 🚀**
