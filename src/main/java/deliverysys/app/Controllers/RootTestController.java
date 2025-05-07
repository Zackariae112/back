package deliverysys.app.Controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RootTestController {

    @GetMapping("/")
    public String status() {
        System.out.println("✅ Root '/' endpoint hit — temporary fallback controller");
        return "App is running — temporary root";
    }
}
