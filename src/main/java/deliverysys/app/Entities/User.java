package deliverysys.app.Entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String role; // ROLE_ADMIN, ROLE_DELIVERY_PERSON, ROLE_CLIENT

    public User(String username, String password, String role) {
        this.username = username;
        this.password = password;
        this.role = role;
    }
} 