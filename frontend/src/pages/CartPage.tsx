
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import Cart from "../components/cart/Cart";
import { createOrder } from "../api/cafekioskApi";
// import { createOrder } from "../api/createOrderMock";
import { useState } from "react";
import OrderSuccessAnimation from "../components/anim/OrderSuccessAnimation";

const CartPage = () => {
  const { cart, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false)
  const [showAnim, setShowAnim] = useState(false);

  const formatPrice = (price:number):string => {
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
        items: cart,
        customerName: "Guest" // Default customer name for kiosk orders
      };
     const order = await createOrder(orderData);   
        
        setShowAnim(true);
     

      
         setTimeout(()=>{
          // 장바구니 비우기
          clearCart();
          // 주문 완료 페이지로 이동
         navigate("/order-complete", { state: { order } });
         },1100)
      

     
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
         <div className="card mt-4">
        <div className="card-body">
          <h5 className="card-title">주문하기</h5>
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
  }

  return (
    <>
    <div>
      <h1 className="mb-4">장바구니</h1>

      <Cart />

      {/* 주문 폼 */}
      <div className="card mt-4">
        <div className="card-body">
          <h5 className="card-title">주문하기</h5>
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
       {/* ✅ 주문 성공 애니메이션 오버레이 */}
      {showAnim && (
        <OrderSuccessAnimation
          durationMs={1100}
          // imgSrc={coffee}
          onComplete={() => setShowAnim(false)}
        />
      )}
    </>
  );
};

export default CartPage;