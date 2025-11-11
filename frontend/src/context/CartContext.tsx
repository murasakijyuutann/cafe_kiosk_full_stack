import  { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

/** =============== 타입 정의 =============== */

export interface MenuItem {
  id: number;
  name: string;
  price: number;
}

export interface CartItem {
  menuItemId: number;
  menuItemName: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface CartContextType {
  cart: CartItem[];
  addToCart: (menuItem: MenuItem, quantity?: number) => void;
  removeFromCart: (menuItemId: number) => void;
  updateQuantity: (menuItemId: number, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
}
const CartContext = createContext<CartContextType | null>(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};


export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState(() => {
    // localStorage에서 장바구니 복원
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // 장바구니 변경 시 localStorage에 저장
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // 장바구니에 추가
  const addToCart = (menuItem: MenuItem, quantity: number = 1) => {
    setCart((prevCart:CartItem[]) => {
      const existingItem = prevCart.find(
        (item) => item.menuItemId === menuItem.id
      );

      if (existingItem) {
        // 기존 항목 수량 증가
        return prevCart.map((item) =>
          item.menuItemId === menuItem.id
            ? { 
              ...item, 
              quantity: item.quantity + quantity,
            subtotal: (item.quantity + quantity) * item.price, }
            : item
        );
      } else {
        // 새 항목 추가
        return [
          ...prevCart,
          {
            menuItemId: menuItem.id,
            menuItemName: menuItem.name,
            price: menuItem.price,
            quantity: quantity,
            subtotal: menuItem.price * quantity,
          },
        ];
      }
    });
  };

  // 장바구니에서 제거
  const removeFromCart = (menuItemId:number) => {
    setCart((prevCart:CartItem[]) =>
      prevCart.filter((item:CartItem) => item.menuItemId !== menuItemId)
    );
  };

  // 수량 업데이트
  const updateQuantity = (menuItemId:number, quantity:number) => {
    if (quantity <= 0) {
      removeFromCart(menuItemId);
      return;
    }

    setCart((prevCart:CartItem[]) =>
      prevCart.map((item) =>
        item.menuItemId === menuItemId
          ? { ...item, quantity, subtotal: item.price * quantity }
          : item
      )
    );
  };

  // 장바구니 비우기
  const clearCart = () => {
    setCart([]);
  };

  // 총액 계산
  const getCartTotal = () => {
    return cart.reduce((total:number, item:CartItem) => total + item.subtotal, 0);
  };

  // 총 개수 계산
  const getCartCount = () => {
    return cart.reduce((count:number, item:CartItem) => count + item.quantity, 0);
  };

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};