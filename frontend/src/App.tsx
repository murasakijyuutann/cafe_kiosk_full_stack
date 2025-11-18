import { Routes, Route } from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import TestMenu from "./pages/TestMenu";
import CartPage from "./pages/CartPage";
import OrderCompletePage from "./pages/OrderPage";
import RightSidebar from "./components/RightSidebar";

function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="container my-4 flex-grow-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<TestMenu />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/order-complete" element={<OrderCompletePage />} />
        </Routes>
      </main>
      <RightSidebar />
      <Footer />
    </div>
  );
}

export default App;
