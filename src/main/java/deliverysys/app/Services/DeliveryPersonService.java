package deliverysys.app.Services;

import deliverysys.app.Entities.DeliveryPerson;
import deliverysys.app.Repositories.DeliveryPersonRepository;
import deliverysys.app.Repositories.AssignmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class DeliveryPersonService {
    
    @Autowired
    private DeliveryPersonRepository deliveryPersonRepository;

    @Autowired
    private AssignmentRepository assignmentRepository;

    // Get all delivery persons
    public List<DeliveryPerson> getAllDeliveryPersons() {
        return deliveryPersonRepository.findAll();
    }

    // Get delivery person by ID
    public DeliveryPerson getDeliveryPersonById(Long id) {
        return deliveryPersonRepository.findById(id).orElse(null);
    }

    // Create new delivery person
    public DeliveryPerson createDeliveryPerson(DeliveryPerson deliveryPerson) {
        // Set default availability if not provided
        if (deliveryPerson.getIsAvailable() == null) {
            deliveryPerson.setIsAvailable(true);
        }
        return deliveryPersonRepository.save(deliveryPerson);
    }

    // Update delivery person
    public DeliveryPerson updateDeliveryPerson(Long id, DeliveryPerson deliveryPerson) {
        if (deliveryPersonRepository.existsById(id)) {
            deliveryPerson.setId(id);
            return deliveryPersonRepository.save(deliveryPerson);
        }
        return null;
    }

    // Delete delivery person
    @Transactional
    public boolean deleteDeliveryPerson(Long id) {
        // Check if delivery person has any assignments
        if (assignmentRepository.existsByDeliveryPersonId(id)) {
            return false; // Cannot delete delivery person with assignments
        }
        
        if (deliveryPersonRepository.existsById(id)) {
            deliveryPersonRepository.deleteById(id);
            return true;
        }
        return false;
    }

    // Get all available delivery persons
    public List<DeliveryPerson> getAvailableDeliveryPersons() {
        return deliveryPersonRepository.findByIsAvailableTrue();
    }

    // Find delivery person by phone number
    public DeliveryPerson findByPhoneNumber(String phoneNumber) {
        return deliveryPersonRepository.findByPhoneNumber(phoneNumber);
    }

    // Search delivery persons by name
    public List<DeliveryPerson> searchByName(String name) {
        return deliveryPersonRepository.findByNameContainingIgnoreCase(name);
    }

    // Toggle availability status
    public DeliveryPerson toggleAvailability(Long id) {
        DeliveryPerson person = getDeliveryPersonById(id);
        if (person != null) {
            person.setIsAvailable(!person.getIsAvailable());
            return deliveryPersonRepository.save(person);
        }
        return null;
    }

    public long count() {
        return deliveryPersonRepository.count();
    }
} 