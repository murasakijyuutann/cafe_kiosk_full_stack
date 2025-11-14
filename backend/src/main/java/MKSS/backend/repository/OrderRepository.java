package MKSS.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import MKSS.backend.model.Order;
import MKSS.backend.model.OrderStatus;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long>{
	
	Optional<Order>findByOrderNumber(String orderNumber);
	
	


}
