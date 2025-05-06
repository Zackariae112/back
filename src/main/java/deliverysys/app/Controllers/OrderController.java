package deliverysys.app.Controllers;

import deliverysys.app.Entities.Order;
import deliverysys.app.Services.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Date;
import java.text.SimpleDateFormat;

import java.util.List;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/orders")
@Tag(name = "Order Management", description = "APIs for managing delivery orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Operation(summary = "Get all orders", description = "Retrieves a list of all delivery orders")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved all orders")
    @GetMapping
    public List<Order> getAllOrders() {
        return orderService.getAllOrders();
    }

    @Operation(summary = "Get order by ID", description = "Retrieves a specific order by its ID")
    @ApiResponse(responseCode = "200", description = "Order found")
    @ApiResponse(responseCode = "404", description = "Order not found")
    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(
            @Parameter(description = "ID of the order to retrieve") @PathVariable Long id) {
        Order order = orderService.getOrderById(id);
        if (order != null) {
            return ResponseEntity.ok(order);
        }
        return ResponseEntity.notFound().build();
    }

    @Operation(summary = "Create new order", description = "Creates a new delivery order")
    @ApiResponse(responseCode = "200", description = "Order created successfully")
    @PostMapping
    public Order createOrder(
            @Parameter(description = "Order details to create") @RequestBody Order order) {
        return orderService.createOrder(order);
    }

    @Operation(summary = "Update order", description = "Updates an existing order")
    @ApiResponse(responseCode = "200", description = "Order updated successfully")
    @ApiResponse(responseCode = "404", description = "Order not found")
    @PutMapping("/{id}")
    public ResponseEntity<Order> updateOrder(
            @Parameter(description = "ID of the order to update") @PathVariable Long id,
            @Parameter(description = "Updated order details") @RequestBody Order order) {
        Order updatedOrder = orderService.updateOrder(id, order);
        if (updatedOrder != null) {
            return ResponseEntity.ok(updatedOrder);
        }
        return ResponseEntity.notFound().build();
    }

    @Operation(summary = "Delete order", description = "Deletes an order by ID")
    @ApiResponse(responseCode = "200", description = "Order deleted successfully")
    @ApiResponse(responseCode = "400", description = "Cannot delete order with assignments")
    @ApiResponse(responseCode = "404", description = "Order not found")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(
            @Parameter(description = "ID of the order to delete") @PathVariable Long id) {
        boolean deleted = orderService.deleteOrder(id);
        if (deleted) {
            return ResponseEntity.ok().build();
        } else if (orderService.getOrderById(id) == null) {
            return ResponseEntity.notFound().build();
        } else {
            return ResponseEntity.badRequest().build();
        }
    }

    @Operation(summary = "Get orders by status", description = "Retrieves orders with a specific status")
    @ApiResponse(responseCode = "200", description = "Orders retrieved successfully")
    @GetMapping("/status/{status}")
    public List<Order> getOrdersByStatus(
            @Parameter(description = "Status to filter orders (e.g., UnAssigned, ASSIGNED, DELIVERED)") @PathVariable String status) {
        return orderService.getOrdersByStatus(status);
    }

    @Operation(summary = "Search orders by client name", description = "Searches orders by client name")
    @ApiResponse(responseCode = "200", description = "Orders found")
    @GetMapping("/search")
    public List<Order> searchOrdersByClientName(
            @Parameter(description = "Client name to search for") @RequestParam String clientName) {
        return orderService.searchOrdersByClientName(clientName);
    }

    @Operation(summary = "Get orders between dates", description = "Retrieves orders within a date range")
    @ApiResponse(responseCode = "200", description = "Orders retrieved successfully")
    @GetMapping("/date-range")
    public List<Order> getOrdersBetweenDates(
            @Parameter(description = "Start date (yyyy-MM-dd)") @RequestParam String startDate,
            @Parameter(description = "End date (yyyy-MM-dd)") @RequestParam String endDate) throws Exception {
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
        Date start = format.parse(startDate);
        Date end = format.parse(endDate);
        return orderService.getOrdersBetweenDates(start, end);
    }

    @Operation(summary = "Get unassigned orders", description = "Retrieves all unassigned orders")
    @ApiResponse(responseCode = "200", description = "Unassigned orders retrieved")
    @GetMapping("/pending")
    public List<Order> getPendingOrders() {
        return orderService.getPendingOrders();
    }

    @Operation(summary = "Get orders by client and status", description = "Retrieves orders filtered by client name and status")
    @ApiResponse(responseCode = "200", description = "Orders retrieved successfully")
    @GetMapping("/client-status")
    public List<Order> getOrdersByClientAndStatus(
            @Parameter(description = "Client name to filter by") @RequestParam String clientName,
            @Parameter(description = "Status to filter by") @RequestParam String status) {
        return orderService.getOrdersByClientAndStatus(clientName, status);
    }

    @Operation(summary = "Count orders", description = "Retrieves the total number of orders")
    @ApiResponse(responseCode = "200", description = "Total orders retrieved")
    @GetMapping("/count")
    public long count() {
        return orderService.count();
    }
}