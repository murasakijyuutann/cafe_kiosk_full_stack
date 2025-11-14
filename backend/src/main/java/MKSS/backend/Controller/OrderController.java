package MKSS.backend.Controller;

import java.util.List;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import MKSS.backend.Service.CartService;
import MKSS.backend.Service.OrderService;
import MKSS.backend.dto.CartItem;
import MKSS.backend.dto.OrderRequest;
import MKSS.backend.dto.OrderResponse;
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
		
		List<CartItem>cart = cartservice.getCart(session);
	
		if(cart.isEmpty()) {
			return"redirect:/cart";
		}
		
	//주문	생성
		OrderRequest request = OrderRequest.builder()
				.customerName(customerName)
				.items(cart)
				.build();
		OrderResponse order = orderService.createOrder(request);
		
		CartService.clearCart(session);
		
		model.addAllAttributes("order",order);
		return "order-complete";
	}
	
	@GetMapping("/{orderNumber}")
	public String viewOrder(@PathVariable String orderNumber, Model model) {
		OrderResponse order = orderService.getOrderByNumber(orderNumber);
		model.addAllAttributes("order", order);
		return"order-complete";
	}
}
