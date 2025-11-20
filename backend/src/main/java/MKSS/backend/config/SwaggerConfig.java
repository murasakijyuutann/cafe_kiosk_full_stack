package MKSS.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI cafeKioskOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Cafe Kiosk API")
                        .description("Spring Boot REST API for Cafe Kiosk System")
                        .version("v1.0")
                        .contact(new Contact()
                                .name("Cafe Kiosk Team")
                                .email("team@cafekiosk.com")));
    }
}
