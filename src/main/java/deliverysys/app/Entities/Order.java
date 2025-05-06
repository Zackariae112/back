package deliverysys.app.Entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;
import java.util.Date;

@Entity
@Table(name = "`order`")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id")
    private Long id;

    @Column(name = "ClientName", nullable = false, length = 100)
    private String clientName;

    @Column(name = "DeliveryAddress", nullable = false)
    private String deliveryAddress;

    @Column(name = "OrderDate", nullable = false)
    @Temporal(TemporalType.DATE)
    private Date orderDate;

    private LocalDateTime createdAt;


    @Column(name = "Status", length = 20)
    private String status = "UnAssigned";
}

