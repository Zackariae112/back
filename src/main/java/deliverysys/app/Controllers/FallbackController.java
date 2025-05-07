package deliverysys.app.Controllers;


import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class FallbackController {
    @RequestMapping(value = "/{path:[^\\.]*}")
    public String redirect() {
        System.out.println("🌐 Fallback hit");

        return "forward:/index.html";
    }

    @RequestMapping(value = "/**/{path:[^\\.]*}")
    public String redirectNested() {
        System.out.println("🌐 Fallback hit");

        return "forward:/index.html";
    }
}
