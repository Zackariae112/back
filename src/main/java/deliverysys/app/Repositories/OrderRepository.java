package deliverysys.app.Repositories;

import deliverysys.app.Entities.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    // Find orders by status
    List<Order> findByStatus(String status);
    
    // Find orders by client name (case insensitive)
    List<Order> findByClientNameContainingIgnoreCase(String clientName);
    
    // Find orders by delivery address (case insensitive)
    List<Order> findByDeliveryAddressContainingIgnoreCase(String address);
    
    // Find orders between dates
    List<Order> findByOrderDateBetween(Date startDate, Date endDate);
    
    // Find pending orders
    List<Order> findByStatusOrderByOrderDateAsc(String status);
    
    // Find orders by client name and status
    List<Order> findByClientNameAndStatus(String clientName, String status);

    List<Order> findTop5ByOrderByCreatedAtDesc();
}
