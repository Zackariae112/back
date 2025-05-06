package deliverysys.app.Security;

import deliverysys.app.Controllers.AuthController;
import deliverysys.app.Entities.User;
import deliverysys.app.Repositories.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AuthControllerTest {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private CustomUserDetailsService userDetailsService;

    @Mock
    private JwtUtil jwtUtil;

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AuthController authController;

    @Test
    void testLogin_Success() {
        // Setup
        Map<String, String> loginRequest = new HashMap<>();
        loginRequest.put("username", "testuser");
        loginRequest.put("password", "password");

        when(jwtUtil.generateToken(any())).thenReturn("test-token");

        // Execute
        ResponseEntity<?> response = authController.createAuthenticationToken(loginRequest);

        // Verify
        assertNotNull(response);
        assertEquals(200, response.getStatusCode().value());
        assertNotNull(response.getBody());
        assertTrue(response.getBody() instanceof Map);
        Map<?, ?> responseBody = (Map<?, ?>) response.getBody();
        assertNotNull(responseBody);
        assertEquals("test-token", responseBody.get("token"));
    }

    @Test
    void testRegister_Success() {
        // Setup
        Map<String, String> registrationRequest = new HashMap<>();
        registrationRequest.put("username", "newuser");
        registrationRequest.put("password", "password");
        registrationRequest.put("role", "CLIENT");

        when(userRepository.findByUsername("newuser")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("password")).thenReturn("encoded-password");
        when(userRepository.save(any(User.class))).thenReturn(new User());

        // Execute
        ResponseEntity<?> response = authController.registerUser(registrationRequest);

        // Verify
        assertNotNull(response);
        assertEquals(200, response.getStatusCode().value());
        assertEquals("User registered successfully", response.getBody());
    }

    @Test
    void testRegister_UsernameExists() {
        // Setup
        Map<String, String> registrationRequest = new HashMap<>();
        registrationRequest.put("username", "existinguser");
        registrationRequest.put("password", "password");
        registrationRequest.put("role", "CLIENT");

        when(userRepository.findByUsername("existinguser")).thenReturn(Optional.of(new User()));

        // Execute
        ResponseEntity<?> response = authController.registerUser(registrationRequest);

        // Verify
        assertNotNull(response);
        assertEquals(400, response.getStatusCode().value());
        assertEquals("Username already exists", response.getBody());
    }
} 