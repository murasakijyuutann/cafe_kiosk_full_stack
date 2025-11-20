package MKSS.backend.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartItem {

	private Long menuItemId;
	private String menuItemName;
	private BigDecimal price;
	private Integer quantity;
	private BigDecimal subtotal;
	
	public void calculateSubtotal() {
		if(price != null && quantity != null) {
			this.subtotal = price.multiply(BigDecimal.valueOf(quantity));
		}
	}
}
