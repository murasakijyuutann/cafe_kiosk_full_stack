
import { useCart } from "../../context/CartContext";
import type { CartItem as CartItemType } from "../../context/CartContext"

interface Props{
    item: CartItemType;
}
const CartItem = ({ item }: Props) => {
  const { updateQuantity, removeFromCart } = useCart();

  const formatPrice = (price: number):string => {
    return new Intl.NumberFormat("ko-KR").format(price);
  };

  return (
    <tr>
      <td>{item.menuItemName}</td>
      <td>{formatPrice(item.price)}원</td>
      <td>
        <input
          type="number"
          className="form-control"
          value={item.quantity}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            updateQuantity(item.menuItemId, parseInt(e.target.value) || 0)
          }
          min={1}
          max={99}
          style={{ width: "80px" }}
        />
      </td>
      <td>{formatPrice(item.subtotal)}원</td>
      <td>
        <button
          className="btn btn-sm btn-danger"
          onClick={() => removeFromCart(item.menuItemId)}
        >
          삭제
        </button>
      </td>
    </tr>
  );
};

export default CartItem;