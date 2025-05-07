package deliverysys.app.Controllers;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;


@RestController
public class HealthController {

    @GetMapping("/health")

public String health() {
    
    System.out.println("🩺 Health endpoint called");
    return "OK";
}

}

