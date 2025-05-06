package deliverysys.app.Controllers;

import deliverysys.app.Entities.Assignment;
import deliverysys.app.Entities.DeliveryPerson;
import deliverysys.app.Entities.Order;
import deliverysys.app.Services.AssignmentService;
import deliverysys.app.Services.DeliveryPersonService;
import deliverysys.app.Services.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/assignments")
public class AssignmentController {
    
    @Autowired
    private AssignmentService assignmentService;
    
    @Autowired
    private OrderService orderService;
    
    @Autowired
    private DeliveryPersonService deliveryPersonService;

    // Get all assignments
    @GetMapping
    public List<Assignment> getAllAssignments() {
        return assignmentService.getAllAssignments();
    }

    // Get assignment by ID
    @GetMapping("/{id}")
    public ResponseEntity<Assignment> getAssignmentById(@PathVariable Long id) {
        Assignment assignment = assignmentService.getAssignmentById(id);
        if (assignment != null) {
            return ResponseEntity.ok(assignment);
        }
        return ResponseEntity.notFound().build();
    }

    // Create new assignment
    @PostMapping
    public ResponseEntity<Assignment> createAssignment(
            @RequestParam Long orderId,
            @RequestParam Long deliveryPersonId) {
        
        Order order = orderService.getOrderById(orderId);
        DeliveryPerson deliveryPerson = deliveryPersonService.getDeliveryPersonById(deliveryPersonId);
        
        if (order == null || deliveryPerson == null) {
            return ResponseEntity.badRequest().build();
        }
        
        if (!deliveryPerson.getIsAvailable()) {
            return ResponseEntity.badRequest().body(null); // Delivery person not available
        }
        
        Assignment assignment = assignmentService.createAssignment(order, deliveryPerson);
        return ResponseEntity.ok(assignment);
    }

    // Update assignment status
    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String newStatus = body.get("status");
        if (newStatus == null) {
            return ResponseEntity.badRequest().body("Missing status");
        }
        Assignment updated = assignmentService.updateAssignmentStatus(id, newStatus);
        if (updated == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updated);
    }

    // Delete assignment
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAssignment(@PathVariable Long id) {
        assignmentService.deleteAssignment(id);
        return ResponseEntity.ok().build();
    }

    // Get assignments by order
    @GetMapping("/order/{orderId}")
    public List<Assignment> getAssignmentsByOrder(@PathVariable Long orderId) {
        return assignmentService.getAssignmentsByOrder(orderId);
    }

    // Get assignments by delivery person
    @Operation(summary = "Get assignments by delivery person", description = "Retrieves assignments for a specific delivery person")
    @ApiResponse(responseCode = "200", description = "Assignments retrieved successfully")
    @GetMapping("/delivery-person/{deliveryPersonId}")
    public List<Assignment> getAssignmentsByDeliveryPerson(
            @Parameter(description = "ID of the delivery person") 
            @PathVariable Long deliveryPersonId) {
        return assignmentService.getAssignmentsByDeliveryPerson(deliveryPersonId);
    }

    // Get assignments by status
    @GetMapping("/status/{status}")
    public List<Assignment> getAssignmentsByStatus(@PathVariable String status) {
        return assignmentService.getAssignmentsByStatus(status);
    }

    // Get active assignments
    @GetMapping("/active")
    public List<Assignment> getActiveAssignments() {
        return assignmentService.getActiveAssignments();
    }

    // Get assignments between dates
    @GetMapping("/date-range")
    public List<Assignment> getAssignmentsBetweenDates(
            @RequestParam LocalDateTime startDate,
            @RequestParam LocalDateTime endDate) {
        return assignmentService.getAssignmentsBetweenDates(startDate, endDate);
    }

    // Get assignments by delivery person and status
    @GetMapping("/delivery-person/{deliveryPersonId}/status/{status}")
    public List<Assignment> getAssignmentsByDeliveryPersonAndStatus(
            @PathVariable Long deliveryPersonId,
            @PathVariable String status) {
        return assignmentService.getAssignmentsByDeliveryPersonAndStatus(deliveryPersonId, status);
    }

    // Get assignments by order and status
    @GetMapping("/order/{orderId}/status/{status}")
    public List<Assignment> getAssignmentsByOrderAndStatus(
            @PathVariable Long orderId,
            @PathVariable String status) {
        return assignmentService.getAssignmentsByOrderAndStatus(orderId, status);
    }

    @Operation(summary = "Count assignments", description = "Retrieves the total number of assignments")
    @ApiResponse(responseCode = "200", description = "Total assignments retrieved")
    @GetMapping("/count")
    public long count() {
        return assignmentService.count();
    }
} 