package MKSS.backend.Controller;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import MKSS.backend.Service.CartService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
@Controller
@RequestMapping("/cart")
@RequiredArgsConstructor
public class CartController {
	
	private final CartService cartService;
	
	@GetMapping
	public String viewCart(HttpSession session, Model model) {
		List<CartItem> cart = cartService.getCart(session);
		BigDecimal total = CartService.getCartTotal(session);
		
		model.addAllAttributes("cartItems",cart);
		model.addAllAttributes("cartToral",total);
		
		return "cart";
	}
	@PostMapping("/add")
	public String addToCart(
			@RequestParam Long menuItemId,
			@RequestParam(defaultValue = "1") Integer quantity,
			HttpSession session) {
		
		cartService.addToCart(session, menuItemId, quantity);
	}
			
	@PostMapping("/clear")
	public String clearCart(HttpSession session) {
		cartService.clearCart(session);
		return "redirect:/cart";
	}
}
