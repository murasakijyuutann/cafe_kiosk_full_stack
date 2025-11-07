import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

function App() {
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCart, setShowCart] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

  const fetchMenu = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/api/menu`);
      const data = await response.json();
      setMenuItems(data);
    } catch (error) {
      console.error('Error fetching menu:', error);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchMenu();
  }, [fetchMenu]);

  const addToCart = (item) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      setCart(cart.map(cartItem =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (itemId) => {
    setCart(cart.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
    } else {
      setCart(cart.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const submitOrder = async () => {
    if (cart.length === 0) return;

    try {
      const orderData = {
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        totalAmount: getTotalAmount()
      };

      const response = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const order = await response.json();
      setOrderDetails(order);
      setOrderConfirmed(true);
      setCart([]);
      setShowCart(false);
    } catch (error) {
      console.error('Error submitting order:', error);
      alert('주문에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const filteredItems = selectedCategory === 'all'
    ? menuItems
    : menuItems.filter(item => item.category === selectedCategory);

  const categories = [
    { id: 'all', name: '전체', nameEn: 'All' },
    { id: 'coffee', name: '커피', nameEn: 'Coffee' },
    { id: 'tea', name: '차', nameEn: 'Tea' },
    { id: 'dessert', name: '디저트', nameEn: 'Dessert' }
  ];

  if (orderConfirmed && orderDetails) {
    return (
      <div className="App">
        <div className="order-confirmation">
          <div className="confirmation-icon">✅</div>
          <h1>주문이 완료되었습니다!</h1>
          <div className="order-number">
            <p>주문번호</p>
            <h2>#{orderDetails.id}</h2>
          </div>
          <div className="order-summary">
            <h3>주문 내역</h3>
            {orderDetails.items.map((item, index) => (
              <div key={index} className="order-item">
                <span>{item.name} x {item.quantity}</span>
                <span>{(item.price * item.quantity).toLocaleString()}원</span>
              </div>
            ))}
            <div className="order-total">
              <strong>총 금액</strong>
              <strong>{orderDetails.totalAmount.toLocaleString()}원</strong>
            </div>
          </div>
          <button
            className="new-order-btn"
            onClick={() => {
              setOrderConfirmed(false);
              setOrderDetails(null);
            }}
          >
            새로운 주문하기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>🏪 카페 키오스크</h1>
        <button
          className="cart-button"
          onClick={() => setShowCart(!showCart)}
        >
          🛒 장바구니 ({cart.length})
        </button>
      </header>

      <div className="category-filter">
        {categories.map(category => (
          <button
            key={category.id}
            className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>

      <div className="menu-grid">
        {filteredItems.map(item => (
          <div key={item.id} className="menu-item">
            <div className="item-image">{item.image}</div>
            <h3>{item.name}</h3>
            <p className="item-name-en">{item.nameEn}</p>
            <p className="item-description">{item.description}</p>
            <div className="item-footer">
              <span className="item-price">{item.price.toLocaleString()}원</span>
              <button
                className="add-to-cart-btn"
                onClick={() => addToCart(item)}
              >
                담기
              </button>
            </div>
          </div>
        ))}
      </div>

      {showCart && (
        <div className="cart-overlay" onClick={() => setShowCart(false)}>
          <div className="cart-modal" onClick={(e) => e.stopPropagation()}>
            <div className="cart-header">
              <h2>장바구니</h2>
              <button className="close-btn" onClick={() => setShowCart(false)}>✕</button>
            </div>
            <div className="cart-content">
              {cart.length === 0 ? (
                <p className="empty-cart">장바구니가 비어있습니다</p>
              ) : (
                <>
                  {cart.map(item => (
                    <div key={item.id} className="cart-item">
                      <div className="cart-item-info">
                        <span className="cart-item-image">{item.image}</span>
                        <div className="cart-item-details">
                          <h4>{item.name}</h4>
                          <p>{item.price.toLocaleString()}원</p>
                        </div>
                      </div>
                      <div className="cart-item-controls">
                        <button
                          className="quantity-btn"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          -
                        </button>
                        <span className="quantity">{item.quantity}</span>
                        <button
                          className="quantity-btn"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          +
                        </button>
                        <button
                          className="remove-btn"
                          onClick={() => removeFromCart(item.id)}
                        >
                          삭제
                        </button>
                      </div>
                    </div>
                  ))}
                  <div className="cart-total">
                    <h3>총 금액</h3>
                    <h3>{getTotalAmount().toLocaleString()}원</h3>
                  </div>
                  <button className="order-btn" onClick={submitOrder}>
                    주문하기
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

