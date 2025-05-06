package deliverysys.app.Services;

import deliverysys.app.Entities.Order;
import deliverysys.app.Repositories.OrderRepository;
import deliverysys.app.Repositories.AssignmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;

@Service
public class OrderService {
    
    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private AssignmentRepository assignmentRepository;

    // Get all orders
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    // Get order by ID
    public Order getOrderById(Long id) {
        return orderRepository.findById(id).orElse(null);
    }

    // Create new order
    public Order createOrder(Order order) {
        // Set default status if not provided
        if (order.getStatus() == null) {
            order.setStatus("UnAssigned");
        }
        // Set current date if not provided
        if (order.getOrderDate() == null) {
            order.setOrderDate(new Date());
        }
        return orderRepository.save(order);
    }

    // Update order
    public Order updateOrder(Long id, Order order) {
        if (orderRepository.existsById(id)) {
            order.setId(id);
            return orderRepository.save(order);
        }
        return null;
    }

    // Delete order
    @Transactional
    public boolean deleteOrder(Long id) {
        // Check if order has any assignments
        if (assignmentRepository.existsByOrderId(id)) {
            return false; // Cannot delete order with assignments
        }
        
        if (orderRepository.existsById(id)) {
            orderRepository.deleteById(id);
            return true;
        }
        return false;
    }

    // Get orders by status
    public List<Order> getOrdersByStatus(String status) {
        return orderRepository.findByStatus(status);
    }

    // Search orders by client name
    public List<Order> searchOrdersByClientName(String clientName) {
        return orderRepository.findByClientNameContainingIgnoreCase(clientName);
    }

    // Get orders between dates
    public List<Order> getOrdersBetweenDates(Date startDate, Date endDate) {
        return orderRepository.findByOrderDateBetween(startDate, endDate);
    }

    // Get pending orders sorted by date
    public List<Order> getPendingOrders() {
        return orderRepository.findByStatusOrderByOrderDateAsc("UnAssigned");
    }

    // Get orders by client and status
    public List<Order> getOrdersByClientAndStatus(String clientName, String status) {
        return orderRepository.findByClientNameAndStatus(clientName, status);
    }

    public long count() {
        return orderRepository.count();
    }

    public List<Order> findTop5ByOrderByCreatedAtDesc() {
        return orderRepository.findTop5ByOrderByCreatedAtDesc();
    }
} 