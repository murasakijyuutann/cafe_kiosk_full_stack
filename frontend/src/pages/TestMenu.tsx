// src/pages/TestMenu.tsx
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const fakeMenu = [
  { id: 1, name: "아메리카노", price: 3000 },
  { id: 2, name: "라떼", price: 3800 },
];

const formatPrice = (n: number) => new Intl.NumberFormat("ko-KR").format(n);

const TestMenu = () => {
  const { addToCart } = useCart(); // ✅ CartContext에서 제공된다고 가정

  const handleAdd = (item: { id: number; name: string; price: number }) => {
    // CartContext가 기대하는 형태에 맞춰 전달 (예: quantity 1)
   addToCart({ id: item.id, name: item.name, price: item.price},1 );
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>메뉴</h1>
      <ul style={{ padding: 0 }}>
        {fakeMenu.map((m) => (
          <li
            key={m.id}
            style={{
              listStyle: "none",
              background: "#f8f9fa",
              margin: "8px 0",
              padding: "12px 14px",
              borderRadius: 8,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <strong>{m.name}</strong>
              <div style={{ fontSize: 13, opacity: 0.8 }}>
                {formatPrice(m.price)}원
              </div>
            </div>
            <button className="btn btn-sm btn-primary" onClick={() => handleAdd(m)}>
              담기
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-3">
        <Link to="/cart" className="btn btn-outline-secondary">
          장바구니로 이동
        </Link>
      </div>
    </div>
  );
};






export default TestMenu
