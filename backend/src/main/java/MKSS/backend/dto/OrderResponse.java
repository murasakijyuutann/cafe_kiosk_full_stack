package MKSS.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderResponse {

	private String orderNumber;
	private String customerName;
	private String status;
	private BigDecimal totalAmount;
	
	@JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
	private LocalDateTime orderedAt;
	
	private List<OrderItemResponse> items;
	
	@Data
	@NoArgsConstructor
	@AllArgsConstructor
	@Builder
	public static class OrderItemResponse {
		private String menuItemName;
		private BigDecimal price;
		private Integer quantity;
		private BigDecimal subtotal;
	}
}
