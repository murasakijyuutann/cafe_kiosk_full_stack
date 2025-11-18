import { Routes, Route } from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import MenuList from "./pages/menu/MenuList";
import CartPage from "./pages/CartPage";
import OrderCompletePage from "./pages/OrderPage";


function App() {
  return (
  <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<MenuList />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/order-complete" element={<OrderCompletePage/>} />
      </Routes>
      <Footer/>
    </>
  );
}

export default App;
