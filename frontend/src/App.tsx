// App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";

import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";

import CartPage from "./pages/CartPage";
import OrderCompletePage from "./pages/OrderPage";
import MenuList from "./pages/menu/MenuList";

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="d-flex flex-column min-vh-100">
          {/* ✅ Navbar도 Router 안으로 */}
          <Navbar />

          <main className="container my-4 flex-grow-1">
            <Routes>
              <Route path="/" element={<Home />} />
              {/* /menu는 하나만 사용 (지금은 TestMenu 기준으로) */}
              <Route path="/menu" element={<MenuList />} />
            
              <Route path="/cart" element={<CartPage />} />
              <Route
                path="/order-complete"
                element={<OrderCompletePage />}
              />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
