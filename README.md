# cafe_kiosk_full_stack

카페 키오스크 풀스택 애플리케이션 (Cafe Kiosk Full-Stack Application)

## 프로젝트 설명 (Project Description)

카페 메뉴를 표시하고 주문을 받을 수 있는 풀스택 키오스크 애플리케이션입니다.

This is a full-stack cafe kiosk application that displays a menu and allows customers to place orders.

## 기술 스택 (Tech Stack)

### Backend
- Node.js
- Express.js
- CORS middleware

### Frontend
- React
- CSS3 (Responsive Design)

## 기능 (Features)

- 📋 메뉴 항목 표시 (Display menu items)
- 🏷️ 카테고리별 필터링 (Filter by category: 커피, 차, 디저트)
- 🛒 장바구니 기능 (Shopping cart functionality)
- ➕➖ 수량 조절 (Quantity adjustment)
- 💰 실시간 가격 계산 (Real-time price calculation)
- ✅ 주문 확인 (Order confirmation)
- 📱 반응형 디자인 (Responsive design)

## 설치 및 실행 (Installation & Running)

### Prerequisites
- Node.js (v14 or higher)
- npm

### Backend Setup

1. Install backend dependencies:
```bash
npm install
```

2. Start the backend server:
```bash
npm start
```

The backend server will run on `http://localhost:3001`

### Frontend Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install frontend dependencies:
```bash
npm install
```

3. Start the frontend development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

### Running Both Servers

You need to run both servers simultaneously:

**Terminal 1 (Backend):**
```bash
npm start
```

**Terminal 2 (Frontend):**
```bash
cd client
npm start
```

## API Endpoints

### Menu Endpoints
- `GET /api/menu` - Get all menu items
- `GET /api/menu/category/:category` - Get menu items by category
- `GET /api/menu/:id` - Get a specific menu item

### Order Endpoints
- `POST /api/orders` - Create a new order
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get a specific order

## 메뉴 카테고리 (Menu Categories)

- ☕ **커피 (Coffee)**: 아메리카노, 카페라떼, 카푸치노, 카라멜 마키아또, 바닐라 라떼
- 🍵 **차 (Tea)**: 녹차 라떼, 얼그레이 티
- 🍰 **디저트 (Dessert)**: 초콜릿 케이크, 치즈 케이크, 크루아상

## 프로젝트 구조 (Project Structure)

```
cafe_kiosk_full_stack/
├── server.js           # Backend Express server
├── package.json        # Backend dependencies
├── client/             # Frontend React application
│   ├── src/
│   │   ├── App.js      # Main React component
│   │   └── App.css     # Styles
│   └── package.json    # Frontend dependencies
└── README.md           # This file
```

## 라이선스 (License)

ISC
