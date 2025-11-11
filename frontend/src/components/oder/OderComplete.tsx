

import { Link } from "react-router-dom";
export type OrderStatus = "PENDING" | "PAID" | "CANCELLED" | "FULFILLED";

export interface OrderItem {
  menuItemName: string;
  price: number;     // 단가
  quantity: number;  // 수량
  subtotal: number;  // 소계(= price * quantity)
}

export interface Order {
  orderNumber: number;
  customerName?: string | null;
  orderedAt: string; // ISO 문자열(예: "2025-11-10T10:20:00Z")
  status: OrderStatus;
  items: OrderItem[];
  totalAmount: number;
}

interface OrderCompleteProps {
  order: Order;
}

const OrderComplete : React.FC<OrderCompleteProps> = ({ order }) => {
  const formatPrice = (price:number): string => {
    return new Intl.NumberFormat("ko-KR").format(price);
  };

  const formatDate = (dateString: string): string => {
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
                <td colSpan={3} className="text-end">
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