package MKSS.backend.Controller;

import java.util.List;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import MKSS.backend.Service.CartService;
import MKSS.backend.Service.OrderService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
@Controller
@RequestMapping("/order")
@RequiredArgsConstructor
public class OrderController {
	
	private final OrderService orderService;
	private final CartService cartservice;
	
	@PostMapping("/checkout")
	public String checkout(
			@RequestParam(required = false)String customerName,
			HttpSession session,
			Model model) {
		
		List<CartItem>cart = cartService.getCart(session);
	
		if(cart.isEmpty()) {
			return"redirect:/cart";
		}
		
	//주문	생성
		OrederRequest request = OrederRequest.builder()
				.customerName(customerName)
				.items(cart)
				.build();
		OrderResponse order = orderService.createOrder(request);
		
		cartSErvice.clearCart(session);
		
		model.addAllAttributes("order",order);
	}
	
}
