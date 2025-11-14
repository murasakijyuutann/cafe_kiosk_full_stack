package dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import model.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderResponse {

	 private Long id;
	 private String orderNumber;
	 private String CustomerName;
	 private BigDecimal totalAmount;
	 private OrderStatus status;
	 private List<CartItem>items;
	 private LocalDateTime orderAt;
}
