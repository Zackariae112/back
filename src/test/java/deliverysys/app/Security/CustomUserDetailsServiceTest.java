package deliverysys.app.Security;

import deliverysys.app.Entities.User;
import deliverysys.app.Repositories.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CustomUserDetailsServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private CustomUserDetailsService userDetailsService;

    @Test
    void testLoadUserByUsername_Success() {
        // Setup
        User user = new User("testuser", "password", "ADMIN");
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));

        // Execute
        UserDetails userDetails = userDetailsService.loadUserByUsername("testuser");

        // Verify
        assertNotNull(userDetails);
        assertEquals("testuser", userDetails.getUsername());
        assertEquals("password", userDetails.getPassword());
        assertTrue(userDetails.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN")));
    }

    @Test
    void testLoadUserByUsername_UserNotFound() {
        // Setup
        when(userRepository.findByUsername("nonexistent")).thenReturn(Optional.empty());

        // Execute & Verify
        assertThrows(UsernameNotFoundException.class, () -> {
            userDetailsService.loadUserByUsername("nonexistent");
        });
    }
} 