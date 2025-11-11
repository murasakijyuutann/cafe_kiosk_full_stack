
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";


import CartPage from "./pages/CartPage";
import OrderCompletePage from "./pages/OderPage";
import TestMenu from "./pages/TestMenu";
import Footer from "./components/Footer";
import RightSidebar from "./components/RightSidebar";


function App() {
  return (
    <CartProvider>
      <Router>
        <div className="d-flex flex-column min-vh-100">
         

          <main className="container my-4 flex-grow-1">
            <Routes>
             
              <Route path="/oder" element={<OrderCompletePage />} />
               <Route path="/menu" element={<TestMenu />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/order-complete" element={<OrderCompletePage />} />
          
            </Routes>
          </main>
           <RightSidebar/>
          <Footer/>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
