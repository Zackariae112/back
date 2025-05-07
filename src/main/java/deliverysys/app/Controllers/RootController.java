package deliverysys.app.Controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RootController {
    @GetMapping("/")
    public String root() {
        System.out.println("✅ Root '/' endpoint hit");
        return "App is running!";
    }
}





