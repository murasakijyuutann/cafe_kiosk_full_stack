package MKSS.backend.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import MKSS.backend.dto.CartItem;
import MKSS.backend.exception.ResourceNotFoundException;
import MKSS.backend.model.MenuItem;
import MKSS.backend.repository.MenuItemRepository;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CartService {

	private final MenuItemRepository menuItemRepository;
	private static final String CART_SESSION_KEY = "CART";

	@SuppressWarnings("unchecked")
	public List<CartItem> getCart(HttpSession session) {
		List<CartItem> cart = (List<CartItem>) session.getAttribute(CART_SESSION_KEY);
		if (cart == null) {
			cart = new ArrayList<>();
			session.setAttribute(CART_SESSION_KEY, cart);
		}
		return cart;
	}

	public void addToCart(HttpSession session, Long menuItemId, Integer quantity) {
		MenuItem menuItem = menuItemRepository.findById(menuItemId)
				.orElseThrow(() -> new ResourceNotFoundException("MenuItem", "id", menuItemId));

		List<CartItem> cart = getCart(session);

		// Check if item already exists in cart
		CartItem existingItem = cart.stream()
				.filter(item -> item.getMenuItemId().equals(menuItemId))
				.findFirst()
				.orElse(null);

		if (existingItem != null) {
			existingItem.setQuantity(existingItem.getQuantity() + quantity);
			existingItem.calculateSubtotal();
		} else {
			CartItem newItem = CartItem.builder()
					.menuItemId(menuItem.getId())
					.menuItemName(menuItem.getName())
					.price(menuItem.getPrice())
					.quantity(quantity)
					.build();
			newItem.calculateSubtotal();
			cart.add(newItem);
		}

		session.setAttribute(CART_SESSION_KEY, cart);
	}

	public void clearCart(HttpSession session) {
		session.removeAttribute(CART_SESSION_KEY);
	}

	public static BigDecimal getCartTotal(HttpSession session) {
		@SuppressWarnings("unchecked")
		List<CartItem> cart = (List<CartItem>) session.getAttribute(CART_SESSION_KEY);
		if (cart == null || cart.isEmpty()) {
			return BigDecimal.ZERO;
		}
		return cart.stream()
				.map(CartItem::getSubtotal)
				.reduce(BigDecimal.ZERO, BigDecimal::add);
	}
}
