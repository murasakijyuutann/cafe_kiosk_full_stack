package MKSS.backend.Controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import MKSS.backend.Service.CartService;
import MKSS.backend.Service.OrderService;
import MKSS.backend.dto.CartItem;
import MKSS.backend.dto.OrderRequest;
import MKSS.backend.dto.OrderResponse;
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
			@RequestParam(required = false) String customerName,
			HttpSession session) {

		List<CartItem> cart = cartService.getCart(session);

		if(cart.isEmpty()) {
			Map<String, Object> errorResponse = new HashMap<>();
			errorResponse.put("success", false);
			errorResponse.put("message", "Cart is empty");
			return ResponseEntity.badRequest().body(errorResponse);
		}

		// Create order
		OrderRequest request = OrderRequest.builder()
				.customerName(customerName)
				.items(cart)
				.build();
		OrderResponse order = orderService.createOrder(request);

		cartService.clearCart(session);

		Map<String, Object> response = new HashMap<>();
		response.put("success", true);
		response.put("order", order);

		return ResponseEntity.ok(response);
	}
}
