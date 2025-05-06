package deliverysys.app.Repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import deliverysys.app.Entities.DeliveryPerson;

@Repository
public interface DeliveryPersonRepository extends JpaRepository<DeliveryPerson, Long> {
    // Basic CRUD operations are automatically provided by JpaRepository
    // Add custom query methods here if needed
    List<DeliveryPerson> findByIsAvailableTrue();
    
    // Find delivery person by phone number
    DeliveryPerson findByPhoneNumber(String phoneNumber);
    
    // Find delivery person by name (case insensitive)
    List<DeliveryPerson> findByNameContainingIgnoreCase(String name);
}
