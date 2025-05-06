package deliverysys.app.Entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "Assignment")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Assignment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "OrderId", nullable = false)
    private Order order;

    @ManyToOne
    @JoinColumn(name = "DeliveryPersonId", nullable = false)
    private DeliveryPerson deliveryPerson;

    @Column(name = "AssignedAt", nullable = false)
    private LocalDateTime assignedAt;

    @Column(name = "Status", length = 50)
    private String status = "PENDING";
} 