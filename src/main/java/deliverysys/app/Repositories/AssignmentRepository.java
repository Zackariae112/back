package deliverysys.app.Repositories;

import deliverysys.app.Entities.Assignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AssignmentRepository extends JpaRepository<Assignment, Long> {
    // Find assignments by order
    List<Assignment> findByOrderId(Long orderId);
    
    // Find assignments by delivery person
    List<Assignment> findByDeliveryPersonId(Long deliveryPersonId);
    
    // Find assignments by status
    List<Assignment> findByStatus(String status);
    
    // Find assignments between dates
    List<Assignment> findByAssignedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    // Find assignments by delivery person and status
    List<Assignment> findByDeliveryPersonIdAndStatus(Long deliveryPersonId, String status);
    
    // Find assignments by order and status
    List<Assignment> findByOrderIdAndStatus(Long orderId, String status);
    
    // Find active assignments (not delivered)
    List<Assignment> findByStatusNot(String status);
    
    long countByStatus(String status);
    
    List<Assignment> findTop5ByOrderByAssignedAtDesc();

    boolean existsByOrderId(Long orderId);

    boolean existsByDeliveryPersonId(Long deliveryPersonId);
} 