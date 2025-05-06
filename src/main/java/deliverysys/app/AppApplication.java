package deliverysys.app;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import java.util.Arrays;


@SpringBootApplication
public class AppApplication {

	@Autowired
    private Environment environment;

    public static void main(String[] args) {
        System.out.println("🚀 APP IS STARTING");
        SpringApplication.run(AppApplication.class, args);
    }

    @PostConstruct
    public void logActiveProfile() {
        System.out.println("🔧 Active Spring Profile: " + Arrays.toString(environment.getActiveProfiles()));
    }

}
