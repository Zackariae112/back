package deliverysys.app.Services;

import deliverysys.app.Entities.Assignment;
import deliverysys.app.Entities.DeliveryPerson;
import deliverysys.app.Entities.Order;
import deliverysys.app.Repositories.AssignmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AssignmentService {
    
    @Autowired
    private AssignmentRepository assignmentRepository;

    // Get all assignments
    public List<Assignment> getAllAssignments() {
        return assignmentRepository.findAll();
    }

    // Get assignment by ID
    public Assignment getAssignmentById(Long id) {
        return assignmentRepository.findById(id).orElse(null);
    }

    // Create new assignment
    @Transactional
    public Assignment createAssignment(Order order, DeliveryPerson deliveryPerson) {
        Assignment assignment = new Assignment();
        assignment.setOrder(order);
        assignment.setDeliveryPerson(deliveryPerson);
        assignment.setAssignedAt(LocalDateTime.now());
        assignment.setStatus("OUT FOR DELIVERY");
        
        // Mark delivery person as unavailable
        deliveryPerson.setIsAvailable(false);
        
        // Mark order as assigned
        order.setStatus("Assigned");
        
        return assignmentRepository.save(assignment);
    }

    // Update assignment status
    @Transactional
    public Assignment updateAssignmentStatus(Long id, String status) {
        Assignment assignment = getAssignmentById(id);
        if (assignment != null) {
            assignment.setStatus(status);
            // If delivered, update order and delivery person
            if (status != null && status.equalsIgnoreCase("Delivered")) {
                if (assignment.getOrder() != null) {
                    assignment.getOrder().setStatus("Completed");
                }
                if (assignment.getDeliveryPerson() != null) {
                    assignment.getDeliveryPerson().setIsAvailable(true);
                }
            }
            // If cancelled, update order and delivery person
            if (status != null && status.equalsIgnoreCase("Cancelled")) {
                if (assignment.getOrder() != null) {
                    assignment.getOrder().setStatus("Cancelled");
                }
                if (assignment.getDeliveryPerson() != null) {
                    assignment.getDeliveryPerson().setIsAvailable(true);
                }
            }
            // If pending, update order and delivery person
            if (status != null && status.equalsIgnoreCase("Pending")) {
                if (assignment.getOrder() != null) {
                    assignment.getOrder().setStatus("Pending Assignment");
                }
                if (assignment.getDeliveryPerson() != null) {
                    assignment.getDeliveryPerson().setIsAvailable(true);
                }
            }
            // If out for delivery, update order and delivery person
            if (status != null && status.equalsIgnoreCase("Out For Delivery")) {
                if (assignment.getOrder() != null) {
                    assignment.getOrder().setStatus("Assigned");
                }
                if (assignment.getDeliveryPerson() != null) {
                    assignment.getDeliveryPerson().setIsAvailable(false);
                }
            }
            return assignmentRepository.save(assignment);
        }
        return null;
    }

    // Delete assignment
    @Transactional
    public void deleteAssignment(Long id) {
        Assignment assignment = getAssignmentById(id);
        if (assignment != null) {
            // Set order status to UnAssigned
            if (assignment.getOrder() != null) {
                assignment.getOrder().setStatus("UnAssigned");
            }
            // Set delivery person as available
            if (assignment.getDeliveryPerson() != null) {
                assignment.getDeliveryPerson().setIsAvailable(true);
            }
            assignmentRepository.deleteById(id);
        }
    }

    // Get assignments by order
    public List<Assignment> getAssignmentsByOrder(Long orderId) {
        return assignmentRepository.findByOrderId(orderId);
    }

    // Get assignments by delivery person
    public List<Assignment> getAssignmentsByDeliveryPerson(Long deliveryPersonId) {
        return assignmentRepository.findByDeliveryPersonId(deliveryPersonId);
    }

    // Get assignments by status
    public List<Assignment> getAssignmentsByStatus(String status) {
        return assignmentRepository.findByStatus(status);
    }

    // Get active assignments (not delivered)
    public List<Assignment> getActiveAssignments() {
        return assignmentRepository.findByStatusNot("DELIVERED");
    }

    // Get assignments between dates
    public List<Assignment> getAssignmentsBetweenDates(LocalDateTime startDate, LocalDateTime endDate) {
        return assignmentRepository.findByAssignedAtBetween(startDate, endDate);
    }

    // Get assignments by delivery person and status
    public List<Assignment> getAssignmentsByDeliveryPersonAndStatus(Long deliveryPersonId, String status) {
        return assignmentRepository.findByDeliveryPersonIdAndStatus(deliveryPersonId, status);
    }

    // Get assignments by order and status
    public List<Assignment> getAssignmentsByOrderAndStatus(Long orderId, String status) {
        return assignmentRepository.findByOrderIdAndStatus(orderId, status);
    }

    public long countByStatus(String status) {
        return assignmentRepository.countByStatus(status);
    }

    public List<Assignment> findTop5ByOrderByAssignedAtDesc() {
        return assignmentRepository.findTop5ByOrderByAssignedAtDesc();
    }

    public long count() {
        return assignmentRepository.count();
    }
} 