// src/pages/TestMenu.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import MenuDetailModal from "../components/ui/MenuDetailModal";

const fakeMenu = [
  { id: 1, name: "아메리카노", price: 3000 ,description:"극한의 기본기가 연마된 에스프레소 기계로 제조된 아이스커피"},
  { id: 2, name: "라떼", price: 3800 ,description:"어제 짠 우유로 만든 신선한 우유입니다"},
];

const formatPrice = (n: number) => new Intl.NumberFormat("ko-KR").format(n);

const TestMenu = () => {
  const { addToCart } = useCart(); // ✅ CartContext에서 제공된다고 가정
  // ✅ 모달 열기/닫기 상태
  const [selectedItem, setSelectedItem] = useState<{
    id: number;
    name: string;
    price: number;
    description?: string;
  } | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // ✅ 리스트에서 클릭 시 모달 오픈
  const handleOpenModal = (item: { id: number; name: string; price: number; description?: string }) => {
    setSelectedItem(item);
    setModalOpen(true);
  };


  const handleAdd = (item: { id: number; name: string; price: number },quantity=1) => {
    // CartContext가 기대하는 형태에 맞춰 전달 (예: quantity 1)
   addToCart({ id: item.id, name: item.name, price: item.price}, quantity );
  };
   // ✅ 모달에서 장바구니 담기
  const handleAddToCart = (item: { id: number; name: string; price: number },quantity=1) => {
    addToCart({ id: item.id, name: item.name, price: item.price }, quantity);
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
            }}onClick={() => handleOpenModal(m)} // ✅ 클릭 시 모달 띄우기
          >
            <div>
              <strong>{m.name}</strong>
              <div style={{ fontSize: 13, opacity: 0.8 }}>
                {formatPrice(m.price)}원
              </div>
            </div>
            <button className="btn btn-sm btn-primary" 
            onClick={(e) => {
              e.stopPropagation();
              handleAdd(m)}}>
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
      {/* ✅ 상세 모달 */}
      <MenuDetailModal
        open={modalOpen}
        item={
          selectedItem
            ? {
                id: selectedItem.id,
                name: selectedItem.name,
                price: selectedItem.price,
                desc: selectedItem.description,
                quantity: 1,
              }
            : null
        }
        onClose={() => setModalOpen(false)}
        onAddToCart={(item, quantity) => {
          handleAddToCart(item,quantity);
          setModalOpen(false);
        }}
      />
    </div>
  );
};






export default TestMenu
