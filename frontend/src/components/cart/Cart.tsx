
import { useCart } from "../../context/CartContext";
import CartItem from "./CartItem";
import type { CartItem as CartItemType } from "../../context/CartContext";

const Cart = () => {
  const { cart, getCartTotal } = useCart();

  const formatPrice = (price:number): string => {
    return new Intl.NumberFormat("ko-KR").format(price);
  };

  if (cart.length === 0) {
    return null;
  }

  return (
    <table className="table">
      <thead>
        <tr>
          <th>메뉴</th>
          <th>가격</th>
          <th>수량</th>
          <th>소계</th>
          <th>삭제</th>
        </tr>
      </thead>
      <tbody>
        {cart.map((item: CartItemType) => (
          <CartItem key={item.menuItemId} item={item} />
        ))}
      </tbody>
      <tfoot>
        <tr>
          <td colSpan={3} className="text-end">
            <strong>총액:</strong>
          </td>
          <td colSpan={2}>
            <strong className="text-primary fs-5">
              {formatPrice(getCartTotal())}원
            </strong>
          </td>
        </tr>
      </tfoot>
    </table>
  );
};

export default Cart;