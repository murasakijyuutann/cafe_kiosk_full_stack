package service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import dto.CartItem;
import dto.OrderRequest;
import dto.OrderResponse;
import model.MenuItem;
import model.Order;
import model.OrderItem;
import model.OrderStatus;
import repository.OrderRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderService {

	private final OrderRepository orderRepository;
	private final MenuService menuService;
	
	//주문 생성
	public OrderResponse createOrder(OrderRequest request) {
		//주문 번호 생성
		String orderNumber = generateOrderNumber();
		
		//총액 계산
		BigDecimal totalAmount = request.getItem().stream()
				.map(CartItem::getSubtotal)
				.reduce(BigDecimal.ZERO,BigDecimal::add);
		
		//무준 엔티티 생성
		Order order =Order.builder()
				.orderNumber(orderNumber)
				.customerName(request.getCustomerName())
				.totalAmount(totalAmount)
				.status(OrderStatus.PENDING)
				.build();
		
		//주문 항목 추가
		for(CartItem cartItem : request.getItem()) {
			MenuItem menuitem = menuService.getMenuItemById(cartItem.getMenuItemId());
	
			OrderItem orderItem = OrderItem.builder()
					.order(order)
					.menuItem(menuitem)
					.quantity(cartItem.getQuantity())
					.price(cartItem.getPrice())
					.build();
			orderItem.calculateSubtotal();
			
			order.getOrderItems().add(orderItem);
			
		}
		//저장
		Order savedOrder = orderRepository.save(order);

		//응답 DTo변환
		return convertToResponse(savedOrder);
	}
	//주문 조회
	@Transactional(readOnly = true)
	public OrderResponse getOrderByNumber(String orderNumber) {
		Order order = orderRepository.findByOrderNumber(ordernumber)
				.orElseThrow(() -> new RuntimeException("주문을 찾을 수 없습니다: "+orderNumber));
						return convertToResponse(order);
	}
	//주문 번호 생성
	private String generateOrderNumber() {
		String dateStr = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
		long count = orderRepository.count() + 1;
		return String.format("ORD-%s-%03d",dateStr, count);
	}
	//order -> OrderResponse 변환
	private OrderResponse convertToResponse(Order order) {
		List<CartItem> itmes = order.getOrderItems().stream()
				.map(orderItem -> CartItem.builder()
						.menuItemId(orderItem.getMenuItem().getId())
						.menuItemName(orderItem.getMenuItem().getName())
						.price(orderItem.getPrice())
						.quantity(orderItem.getQuantity())
						.subtotal(orderItem.getSubtotal())
						.build())
				.collect(Collectors.toList());
		
		return OrderResponse.builder()
				.id(order.getId())
				.orderNumber(order.getOrderNumber())
				.CustomerName(order.getCustomerName())
				.totalAmount(order.getTotalAmount())
				.status(order.getStatus())
				.items(itmes)
				.orderAt(order.getOrderedAt())
				.build();
	}
}