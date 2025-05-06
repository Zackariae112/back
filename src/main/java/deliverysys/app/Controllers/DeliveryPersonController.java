package deliverysys.app.Controllers;

import deliverysys.app.Entities.DeliveryPerson;
import deliverysys.app.Services.DeliveryPersonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;

import java.util.List;

@RestController
@RequestMapping("/api/delivery-persons")
public class DeliveryPersonController {
    
    @Autowired
    private DeliveryPersonService deliveryPersonService;

    // Get all delivery persons
    @GetMapping
    public List<DeliveryPerson> getAllDeliveryPersons() {
        return deliveryPersonService.getAllDeliveryPersons();
    }

    // Get delivery person by ID
    @Operation(summary = "Get delivery person by ID", description = "Retrieves a specific delivery person by their ID")
    @ApiResponse(responseCode = "200", description = "Delivery person found")
    @ApiResponse(responseCode = "404", description = "Delivery person not found")
    @GetMapping("/{id}")
    public ResponseEntity<DeliveryPerson> getDeliveryPersonById(
            @Parameter(description = "ID of the delivery person to retrieve") 
            @PathVariable Long id) {
        DeliveryPerson deliveryPerson = deliveryPersonService.getDeliveryPersonById(id);
        if (deliveryPerson != null) {
            return ResponseEntity.ok(deliveryPerson);
        }
        return ResponseEntity.notFound().build();
    }

    // Create new delivery person
    @PostMapping
    public DeliveryPerson createDeliveryPerson(@RequestBody DeliveryPerson deliveryPerson) {
        return deliveryPersonService.createDeliveryPerson(deliveryPerson);
    }

    // Update delivery person
    @PutMapping("/{id}")
    public ResponseEntity<DeliveryPerson> updateDeliveryPerson(
            @PathVariable Long id,
            @RequestBody DeliveryPerson deliveryPerson) {
        
        DeliveryPerson updatedPerson = deliveryPersonService.updateDeliveryPerson(id, deliveryPerson);
        if (updatedPerson != null) {
            return ResponseEntity.ok(updatedPerson);
        }
        return ResponseEntity.notFound().build();
    }

    // Delete delivery person
    @Operation(summary = "Delete delivery person", description = "Deletes a delivery person by ID")
    @ApiResponse(responseCode = "200", description = "Delivery person deleted successfully")
    @ApiResponse(responseCode = "400", description = "Cannot delete delivery person with assignments")
    @ApiResponse(responseCode = "404", description = "Delivery person not found")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDeliveryPerson(
            @Parameter(description = "ID of the delivery person to delete") 
            @PathVariable Long id) {
        boolean deleted = deliveryPersonService.deleteDeliveryPerson(id);
        if (deleted) {
            return ResponseEntity.ok().build();
        } else if (deliveryPersonService.getDeliveryPersonById(id) == null) {
            return ResponseEntity.notFound().build();
        } else {
            return ResponseEntity.badRequest().build();
        }
    }

    // Get available delivery persons
    @GetMapping("/available")
    public List<DeliveryPerson> getAvailableDeliveryPersons() {
        return deliveryPersonService.getAvailableDeliveryPersons();
    }

    // Find delivery person by phone number
    @GetMapping("/phone/{phoneNumber}")
    public ResponseEntity<DeliveryPerson> findByPhoneNumber(@PathVariable String phoneNumber) {
        DeliveryPerson person = deliveryPersonService.findByPhoneNumber(phoneNumber);
        if (person != null) {
            return ResponseEntity.ok(person);
        }
        return ResponseEntity.notFound().build();
    }

    // Search delivery persons by name
    @GetMapping("/search")
    public List<DeliveryPerson> searchByName(@RequestParam String name) {
        return deliveryPersonService.searchByName(name);
    }

    // Toggle availability status
    @PutMapping("/{id}/toggle-availability")
    public ResponseEntity<DeliveryPerson> toggleAvailability(@PathVariable Long id) {
        DeliveryPerson person = deliveryPersonService.toggleAvailability(id);
        if (person != null) {
            return ResponseEntity.ok(person);
        }
        return ResponseEntity.notFound().build();
    }

    @Operation(summary = "Count delivery persons", description = "Retrieves the total number of delivery persons")
    @ApiResponse(responseCode = "200", description = "Total delivery persons retrieved")
    @GetMapping("/count")
    public long count() {
        return deliveryPersonService.count();
    }
} 