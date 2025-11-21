package MKSS.backend.Controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestBody;

import MKSS.backend.Service.CartService;
import MKSS.backend.Service.OrderService;
import MKSS.backend.dto.CartItem;
import MKSS.backend.dto.OrderRequest;
import MKSS.backend.dto.OrderResponse;
import MKSS.backend.exception.EmptyCartException;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/order")
@RequiredArgsConstructor
public class OrderController {

	private final OrderService orderService;
	private final CartService cartService;

	@PostMapping("/checkout")
	public ResponseEntity<Map<String, Object>> checkout(
			@RequestBody(required = false) OrderRequest orderRequest,
			HttpSession session) {

		List<CartItem> cart;
		String customerName = null;

		// Option A: If request has items, use those (client-side cart)
		if (orderRequest != null && orderRequest.getItems() != null && !orderRequest.getItems().isEmpty()) {
			cart = orderRequest.getItems();
			customerName = orderRequest.getCustomerName();
		}
		// Fallback: Use session cart (server-side cart)
		else {
			cart = cartService.getCart(session);
			if (cart.isEmpty()) {
				throw new EmptyCartException("Cannot checkout with an empty cart");
			}
		}

		// Create order
		OrderRequest request = OrderRequest.builder()
				.customerName(customerName)
				.items(cart)
				.build();
		OrderResponse order = orderService.createOrder(request);

		// Clear session cart if it was used
		cartService.clearCart(session);

		Map<String, Object> response = new HashMap<>();
		response.put("success", true);
		response.put("order", order);

		return ResponseEntity.ok(response);
	}
}