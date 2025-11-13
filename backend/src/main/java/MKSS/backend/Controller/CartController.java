package MKSS.backend.Controller;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import MKSS.backend.Service.CartService;
import MKSS.backend.dto.CartItem;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/cart")
@RequiredArgsConstructor
public class CartController {

	private final CartService cartService;

	@GetMapping
	public ResponseEntity<Map<String, Object>> viewCart(HttpSession session) {
		List<CartItem> cart = cartService.getCart(session);
		BigDecimal total = CartService.getCartTotal(session);

		Map<String, Object> response = new HashMap<>();
		response.put("cartItems", cart);
		response.put("cartTotal", total);

		return ResponseEntity.ok(response);
	}

	@PostMapping("/add")
	public ResponseEntity<Map<String, Object>> addToCart(
			@RequestParam Long menuItemId,
			@RequestParam(defaultValue = "1") Integer quantity,
			HttpSession session) {

		cartService.addToCart(session, menuItemId, quantity);

		Map<String, Object> response = new HashMap<>();
		response.put("success", true);
		response.put("message", "Item added to cart");

		return ResponseEntity.ok(response);
	}

	@PostMapping("/clear")
	public ResponseEntity<Map<String, Object>> clearCart(HttpSession session) {
		cartService.clearCart(session);

		Map<String, Object> response = new HashMap<>();
		response.put("success", true);
		response.put("message", "Cart cleared");

		return ResponseEntity.ok(response);
	}
}
