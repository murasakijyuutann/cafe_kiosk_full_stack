package MKSS.backend.Service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import MKSS.backend.dto.CartItem;
import MKSS.backend.model.MenuItem;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CartService {

	private static final String CART_SESSION_KEY = "cart";
	
	private final MenuService menuService;
	
	//장바구니 조회
	@SuppressWarnings("uncheked")
	public List<CartItem>getCart(HttpSession session){
		List<CartItem>cart = (List<CartItem>)session.getAttribute(CART_SESSION_KEY);
		if(cart == null) {
			cart = new ArrayList<>();
			session.setAttribute(CART_SESSION_KEY, cart);
		}
		return cart;
	}
	//장바구니에 항목 추가
	public void addToCart(HttpSession session, Long menuItemId, Integer quantity) {
		MenuItem menuitem = menuService.getMenuItemById(menuItemId);
		List<CartItem>cart= getCart(session);
	//이미 장바구니에 있는지 확인
	CartItem esxistingItem = cart.stream()
			.filter(item -> item.getMenuItemId().equals(menuItemId))
			.findFirst()
			.orElse(null);
			
	if(existingItem != null) {
		//수량증가
		existingItem.setQuantity(existingItem.getQuantity()+quantity);
		existingItem.calculateSubtotal();
	}else{
		//새 항목 추가
		CartItem newItem = CartItem.builder()
		.menuItemId(menuItemId.getId())
		.menuItemName(MenuItem.getName())
		.price(MenuItem.getPrice())
		.quantity(quantity)
		.build();
	newItem.calculateSubtotal();
	cart.add(newItem);
	}
	}
	//장바구니에서 항목제거
	public void removeFromCart(HttpSession session, Long menuItemId) {
		List<CartItem>cart = getCart(session);
		cart.removeIf(item -> item.getMenuItemId().equals(menuItemId));
	}
	//장바기누 비우기
	public void cleanCart(HttpSession session) {
		session.removeAttribute(CART_SESSION_KEY);
		
	}
	//장바구니 총액 계상
	public java.math.BigDecimal getCartTotal(HttpSession session){
		List<CartItem>cart = getCart(session);
		return cart.stream()
				.map(CartItem::getSubtotal)
				.reduce(java.math.BigDecimal.ZERO,java.math.BigDecimal::add);
	}
}
