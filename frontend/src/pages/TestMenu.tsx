// src/pages/TestMenu.tsx
import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import styled from "styled-components";
import { useCart } from "../context/CartContext";
import MenuDetailModal from "../components/ui/MenuDetailModal";

type MenuCategory = "커피" | "논커피" | "디저트";

type MenuItem = {
  id: number;
  name: string;
  price: number;
  description: string;
  category: MenuCategory;
};

// ===================== styled components =====================

const PageContainer = styled.div`
  padding: 20px;
`;

const MenuGrid = styled.ul`
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  list-style: none;
`;

const MenuCard = styled.li`
  background: #ffffff;
  border-radius: 10px;
  padding: 12px;
  width: calc(33.33% - 16px); /* 🔥 가로 3개 */
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: transform 0.1s ease;

  &:hover {
    transform: translateY(-3px);
  }
`;

const ImagePlaceholder = styled.div`
  width: 100%;
  height: 120px;
  background-color: #e9ecef;
  border-radius: 8px;
  margin-bottom: 10px;
`;

const ItemName = styled.strong`
  display: block;
  font-size: 1rem;
`;

const ItemCategory = styled.div`
  font-size: 12px;
  opacity: 0.6;
`;

const ItemPrice = styled.div`
  font-size: 14px;
  margin-top: 4px;
`;

const MoveCartButton = styled(Link)`
  display: inline-block;
  margin-top: 20px;
`;

// ===================== Fake Data =====================

const fakeMenu: MenuItem[] = [
  // ☕ 커피
  {
    id: 1,
    name: "아메리카노",
    price: 3000,
    description: "극한의 기본기가 연마된 에스프레소 기계로 제조된 아이스커피",
    category: "커피",
  },
  {
    id: 2,
    name: "라떼",
    price: 3800,
    description: "어제 짠 우유로 만든 신선한 우유입니다",
    category: "커피",
  },
  {
    id: 3,
    name: "카푸치노",
    price: 4000,
    description: "풍부한 우유 거품이 올라간 카푸치노",
    category: "커피",
  },

  // 🍹 논커피
  {
    id: 4,
    name: "레몬에이드",
    price: 3500,
    description: "상큼한 레몬이 들어간 탄산 에이드",
    category: "논커피",
  },
  {
    id: 5,
    name: "자몽에이드",
    price: 3800,
    description: "새콤달콤한 자몽 에이드",
    category: "논커피",
  },
  {
    id: 6,
    name: "복숭아 아이스티",
    price: 3200,
    description: "달콤한 복숭아 향의 아이스티",
    category: "논커피",
  },

  // 🍰 디저트
  {
    id: 7,
    name: "치즈케이크",
    price: 4500,
    description: "진한 치즈 풍미의 정통 치즈케이크",
    category: "디저트",
  },
  {
    id: 8,
    name: "티라미수",
    price: 4800,
    description: "에스프레소가 스며든 부드러운 티라미수",
    category: "디저트",
  },
  {
    id: 9,
    name: "버터 크루아상",
    price: 3200,
    description: "버터 향 가득 바삭한 크루아상",
    category: "디저트",
  },
];

// ===================== Logic =====================

const formatPrice = (n: number) => new Intl.NumberFormat("ko-KR").format(n);

const TestMenu = () => {
  const { addToCart } = useCart();
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get("category") as MenuCategory | null;

  // ✅ 카테고리 필터 (쿼리 없으면 전체)
  const filteredMenu =
    categoryParam != null
      ? fakeMenu.filter((m) => m.category === categoryParam)
      : fakeMenu;

  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // ✅ 리스트에서 바로 장바구니
  const handleAdd = (item: MenuItem, quantity = 1) => {
    // 👉 CartContext가 원래 받던 형태대로만 넘김
    addToCart(
      {
        id: item.id,
        name: item.name,
        price: item.price,
      },
      quantity
    );
    alert(`"${item.name}"장바구니에 담았습니다`);
  };

  // ✅ 모달에서 장바구니 담기
  const handleAddFromModal = (
    item: { id: number; name: string; price: number },
    quantity = 1
  ) => {
    addToCart(
      {
        id: item.id,
        name: item.name,
        price: item.price,
      },
      quantity
    );
  };

  return (
    <PageContainer>
      <h1>메뉴</h1>

      <MenuGrid>
        {filteredMenu.map((m) => (
          <MenuCard
            key={m.id}
            onClick={() => {
              setSelectedItem(m);
              setModalOpen(true);
            }}
          >
            <ImagePlaceholder />

            <ItemName>{m.name}</ItemName>
            <ItemCategory>{m.category}</ItemCategory>
            <ItemPrice>{formatPrice(m.price)}원</ItemPrice>

            <button
              className="btn btn-sm btn-primary mt-2"
              onClick={(e) => {
                e.stopPropagation(); // 카드 클릭과 분리
                handleAdd(m);
              }}
            >
              담기
            </button>
          </MenuCard>
        ))}
      </MenuGrid>

      <MoveCartButton to="/cart" className="btn btn-outline-secondary">
        장바구니로 이동
      </MoveCartButton>

      {/* 상세 모달 */}
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
          // 👉 여기서도 CartContext가 기대하는 형태로 변환해서 전달
          handleAddFromModal(item, quantity);
          setModalOpen(false);
        }}
      />
    </PageContainer>
  );
};

export default TestMenu;
