package deliverysys.app.Entities;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "DeliveryPerson")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DeliveryPerson {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "Id")
	private Long id;
	
	@Column(name = "FN", nullable = false, length = 100)
	private String name;
	
	@Column(name = "PhoneNumber", nullable = false, length = 20) 
	private String phoneNumber;
	
	@Column(name = "IsAvailable")
	private Boolean isAvailable = true;
}
