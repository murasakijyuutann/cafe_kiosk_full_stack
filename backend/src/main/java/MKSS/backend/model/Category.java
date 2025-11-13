package MKSS.backend.model;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
@Entity
@Table(name = "category")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class Category {
	
	@Id
	@GeneratedValue(strategy =GenerationType.IDENTITY)
	private Long id;
	
	@Column(nullable = false, unique= true, length =50)
	private String name;
	
	@Column(length = 200)
	private String description;
	
	@Column(name = "display_order")
	private Integer displayOrder = 0;
	
	@OneToMany(mappedBy = "category", cascade=Cascade.Type.ALL)
	@ToString.Exclude
	@Builder.Default
	private List<MenuItem> menuItems = new ArrayList<>();
	
	@Column(name = "created_at", updatable=false)
	private LocalDateTime createdAt;
	
	@PrePersist
	protected void onCreate() {
		createdAt = LocalDateTime.now();
	}
}
