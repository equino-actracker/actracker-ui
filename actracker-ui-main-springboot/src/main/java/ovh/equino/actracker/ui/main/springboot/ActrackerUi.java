package ovh.equino.actracker.ui.main.springboot;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Don't use this class for local run.
 * Run 'ng serve' in actracker-ui-angular directory instead.
 * <p>
 * If you need to run as Spring Boot application, use './gradlew run' task in rootProject directory.
 */
@SpringBootApplication
public class ActrackerUi {

    public static void main(String[] args) {
        SpringApplication.run(ActrackerUi.class);
    }
}
