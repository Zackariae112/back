package deliverysys.app.Security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;


import static org.junit.jupiter.api.Assertions.*;

class JwtUtilTest {

    private JwtUtil jwtUtil;
    private UserDetails userDetails;

    @BeforeEach
    void setUp() {
        jwtUtil = new JwtUtil();
        userDetails = User.builder()
                .username("testuser")
                .password("password")
                .roles("USER")
                .build();
    }

    @Test
    void testGenerateToken() {
        // Execute
        String token = jwtUtil.generateToken(userDetails);

        // Verify
        assertNotNull(token);
        assertFalse(token.isEmpty());
    }

    @Test
    void testExtractUsername() {
        // Setup
        String token = jwtUtil.generateToken(userDetails);

        // Execute
        String username = jwtUtil.extractUsername(token);

        // Verify
        assertEquals("testuser", username);
    }

    @Test
    void testValidateToken() {
        // Setup
        String token = jwtUtil.generateToken(userDetails);

        // Execute
        boolean isValid = jwtUtil.validateToken(token, userDetails);

        // Verify
        assertTrue(isValid);
    }

    @Test
    void testValidateToken_InvalidUser() {
        // Setup
        String token = jwtUtil.generateToken(userDetails);
        UserDetails differentUser = User.builder()
                .username("differentuser")
                .password("password")
                .roles("USER")
                .build();

        // Execute
        boolean isValid = jwtUtil.validateToken(token, differentUser);

        // Verify
        assertFalse(isValid);
    }
}