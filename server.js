const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Sample menu data
const menuItems = [
  {
    id: 1,
    name: '아메리카노',
    nameEn: 'Americano',
    category: 'coffee',
    price: 4500,
    description: '에스프레소에 뜨거운 물을 더한 커피',
    image: '☕'
  },
  {
    id: 2,
    name: '카페라떼',
    nameEn: 'Cafe Latte',
    category: 'coffee',
    price: 5000,
    description: '에스프레소와 스팀 밀크의 조화',
    image: '🥛'
  },
  {
    id: 3,
    name: '카푸치노',
    nameEn: 'Cappuccino',
    category: 'coffee',
    price: 5000,
    description: '에스프레소, 스팀 밀크, 우유 거품의 완벽한 조화',
    image: '☕'
  },
  {
    id: 4,
    name: '카라멜 마키아또',
    nameEn: 'Caramel Macchiato',
    category: 'coffee',
    price: 5500,
    description: '달콤한 카라멜과 에스프레소의 만남',
    image: '🍮'
  },
  {
    id: 5,
    name: '바닐라 라떼',
    nameEn: 'Vanilla Latte',
    category: 'coffee',
    price: 5500,
    description: '부드러운 바닐라 향이 가득한 라떼',
    image: '🥛'
  },
  {
    id: 6,
    name: '녹차 라떼',
    nameEn: 'Green Tea Latte',
    category: 'tea',
    price: 5500,
    description: '고소한 녹차와 부드러운 우유의 조화',
    image: '🍵'
  },
  {
    id: 7,
    name: '얼그레이 티',
    nameEn: 'Earl Grey Tea',
    category: 'tea',
    price: 4500,
    description: '향긋한 베르가못 향이 특징인 홍차',
    image: '🫖'
  },
  {
    id: 8,
    name: '초콜릿 케이크',
    nameEn: 'Chocolate Cake',
    category: 'dessert',
    price: 6000,
    description: '진한 초콜릿이 가득한 케이크',
    image: '🍰'
  },
  {
    id: 9,
    name: '치즈 케이크',
    nameEn: 'Cheese Cake',
    category: 'dessert',
    price: 6000,
    description: '부드럽고 크리미한 치즈케이크',
    image: '🍰'
  },
  {
    id: 10,
    name: '크루아상',
    nameEn: 'Croissant',
    category: 'dessert',
    price: 3500,
    description: '버터 향 가득한 바삭한 크루아상',
    image: '🥐'
  }
];

// In-memory orders storage
let orders = [];
let orderIdCounter = 1;

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Cafe Kiosk API' });
});

// Get all menu items
app.get('/api/menu', (req, res) => {
  res.json(menuItems);
});

// Get menu items by category
app.get('/api/menu/category/:category', (req, res) => {
  const { category } = req.params;
  const filteredItems = menuItems.filter(item => item.category === category);
  res.json(filteredItems);
});

// Get single menu item
app.get('/api/menu/:id', (req, res) => {
  const { id } = req.params;
  const item = menuItems.find(item => item.id === parseInt(id));
  if (item) {
    res.json(item);
  } else {
    res.status(404).json({ error: 'Menu item not found' });
  }
});

// Create new order
app.post('/api/orders', (req, res) => {
  const { items, totalAmount } = req.body;
  
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Invalid order items' });
  }
  
  const newOrder = {
    id: orderIdCounter++,
    items,
    totalAmount,
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  
  orders.push(newOrder);
  res.status(201).json(newOrder);
});

// Get all orders
app.get('/api/orders', (req, res) => {
  res.json(orders);
});

// Get single order
app.get('/api/orders/:id', (req, res) => {
  const { id } = req.params;
  const order = orders.find(order => order.id === parseInt(id));
  if (order) {
    res.json(order);
  } else {
    res.status(404).json({ error: 'Order not found' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
