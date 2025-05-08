package deliverysys.app.Controllers;

import deliverysys.app.Entities.User;
import deliverysys.app.Repositories.UserRepository;
import deliverysys.app.Security.JwtUtil;
import deliverysys.app.Security.CustomUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> createAuthenticationToken(@RequestBody Map<String, String> loginRequest) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.get("username"), loginRequest.get("password"))
        );

        final UserDetails userDetails = userDetailsService.loadUserByUsername(loginRequest.get("username"));
        final String jwt = jwtUtil.generateToken(userDetails);

        Map<String, String> response = new HashMap<>();
        response.put("token", jwt);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody Map<String, String> registrationRequest) {
        if (userRepository.findByUsername(registrationRequest.get("username")).isPresent()) {
            return ResponseEntity.badRequest().body("Username already exists");
        }

        User user = new User(
                registrationRequest.get("username"),
                passwordEncoder.encode(registrationRequest.get("password")),
                "ADMIN"
        );

        userRepository.save(user);

        return ResponseEntity.ok("User registered successfully");
    }
} 