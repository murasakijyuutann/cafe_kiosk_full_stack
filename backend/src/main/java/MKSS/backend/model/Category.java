package MKSS.backend.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
@Entity
@Table(name = "categories")
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
	
	@OneToMany(mappedBy = "category", cascade=CascadeType.ALL)
	@ToString.Exclude
	@Builder.Default
	@JsonIgnore
	private List<MenuItem> menuItems = new ArrayList<>();
	
	@Column(name = "created_at", updatable=false)
	private LocalDateTime createdAt;
	
	@PrePersist
	protected void onCreate() {
		createdAt = LocalDateTime.now();
	}
}
