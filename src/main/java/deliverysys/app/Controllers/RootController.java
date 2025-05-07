package deliverysys.app.Controllers;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;


@RestController
public class RootController {

    @GetMapping("/")
    public String root() {
        System.out.println("✅ Root '/' endpoint hit");
        return "App is running!";
    }
}



