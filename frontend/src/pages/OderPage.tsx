import { useLocation, Navigate } from "react-router-dom";
import OrderComplete from "../components/oder/OderComplete";

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