package MKSS.backend.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import MKSS.backend.dto.CartItem;
import MKSS.backend.dto.OrderRequest;
import MKSS.backend.dto.OrderResponse;
import MKSS.backend.dto.ResourceNotFoundException;
import MKSS.backend.model.MenuItem;
import MKSS.backend.model.Order;
import MKSS.backend.model.OrderItem;
import MKSS.backend.model.OrderStatus;
import MKSS.backend.repository.MenuItemRepository;
import MKSS.backend.repository.OrderRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OrderService {

	private final OrderRepository orderRepository;
	private final MenuItemRepository menuItemRepository;

	@Transactional
	public OrderResponse createOrder(OrderRequest request) {
		// Generate order number
		String orderNumber = generateOrderNumber();

		// Calculate total amount
		BigDecimal totalAmount = request.getItems().stream()
				.map(CartItem::getSubtotal)
				.reduce(BigDecimal.ZERO, BigDecimal::add);

		// Create order
		Order order = Order.builder()
				.orderNumber(orderNumber)
				.customerName(request.getCustomerName())
				.totalAmount(totalAmount)
				.status(OrderStatus.PENDING)
				.orderItems(new ArrayList<>())
				.build();

		// Create order items
		for (CartItem cartItem : request.getItems()) {
			MenuItem menuItem = menuItemRepository.findById(cartItem.getMenuItemId())
					.orElseThrow(() -> new ResourceNotFoundException("MenuItem", "id", cartItem.getMenuItemId()));

			OrderItem orderItem = OrderItem.builder()
					.order(order)
					.menuItem(menuItem)
					.quantity(cartItem.getQuantity())
					.price(cartItem.getPrice())
					.subtotal(cartItem.getSubtotal())
					.build();

			order.getOrderItems().add(orderItem);
		}

		// Save order
		Order savedOrder = orderRepository.save(order);

		// Create order item responses
		List<OrderResponse.OrderItemResponse> itemResponses = savedOrder.getOrderItems().stream()
				.map(item -> OrderResponse.OrderItemResponse.builder()
						.menuItemName(item.getMenuItem().getName())
						.price(item.getPrice())
						.quantity(item.getQuantity())
						.subtotal(item.getSubtotal())
						.build())
				.toList();

		// Create response
		return OrderResponse.builder()
				.orderNumber(savedOrder.getOrderNumber())
				.customerName(savedOrder.getCustomerName())
				.status(savedOrder.getStatus().toString())
				.totalAmount(savedOrder.getTotalAmount())
				.orderedAt(savedOrder.getCreatedAt())
				.items(itemResponses)
				.build();
	}

	private String generateOrderNumber() {
		// Generate order number with format: ORD-YYYYMMDD-XXXX
		LocalDateTime now = LocalDateTime.now();
		String dateStr = now.format(DateTimeFormatter.ofPattern("yyyyMMdd"));
		long count = orderRepository.count() + 1;
		return String.format("ORD-%s-%04d", dateStr, count);
	}
}
