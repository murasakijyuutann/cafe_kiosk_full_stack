// src/components/menu/MenuDetailModal.tsx
import React, { useEffect } from "react";
import styled from "styled-components";

export type MenuDetail = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  desc?: string;
  description?:string;
  
};

type Props = {
  open: boolean;
  item: MenuDetail | null;
  onClose: () => void;
  onAddToCart: (item: MenuDetail, quantity?: number) => void;
};

const Backdrop = styled.div`
  position: fixed; inset: 0; z-index: 1000;
  background: rgba(0,0,0,.5);
  display: grid; place-items: center;
`;

const Box = styled.div`
  width: 90%; max-width: 380px;
  background: #fff; border-radius: 12px;
  padding: 18px; box-shadow: 0 10px 30px rgba(0,0,0,.25);
  animation: fadeInUp .18s ease-out;
  @keyframes fadeInUp { from{opacity:0; transform: translateY(8px)} to{opacity:1; transform:none} }
`;

const Header = styled.div`
  display:flex; align-items:center; justify-content:space-between; margin-bottom:10px;
`;
const Title = styled.h3` margin:0; font-size:18px; `;
const Close = styled.button`
  border:none; background:transparent; font-size:20px; cursor:pointer;
`;

const Body = styled.div` color:#333; font-size:14px; line-height:1.5; `;
const Price = styled.div` font-weight:700; margin:10px 0; `;

const Footer = styled.div` display:flex; gap:8px; justify-content:flex-end; margin-top:12px; `;
const Btn = styled.button<{ $primary?: boolean }>`
  padding: 8px 12px; border-radius:8px; cursor:pointer; border:1px solid transparent;
  ${({ $primary }) =>
    $primary
      ? `background:#0d6efd; color:#fff; border-color:#0d6efd;`
      : `background:#fff; color:#495057; border-color:#ced4da;`
  }
  &:hover{ filter: brightness(.97); }
`;

const MenuDetailModal: React.FC<Props> = ({ open, item, onClose, onAddToCart }) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open || !item) return null;
  const fmt = (n:number) => new Intl.NumberFormat("ko-KR").format(n);

  return (
    <Backdrop onClick={onClose}>
      <Box onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>{item.name}</Title>
          <Close aria-label="close" onClick={onClose}>×</Close>
        </Header>
        <Body>
          {item.desc && <p style={{ marginTop: 0 }}>{item.desc}</p>}
          <Price>{fmt(item.price)}원</Price>
        </Body>
        <Footer>
          <Btn onClick={onClose}>닫기</Btn>
          <Btn
            $primary
            onClick={() => { onAddToCart(item, 1); onClose(); }}
          >
            장바구니 담기
          </Btn>
        </Footer>
      </Box>
    </Backdrop>
  );
};

export default MenuDetailModal;
