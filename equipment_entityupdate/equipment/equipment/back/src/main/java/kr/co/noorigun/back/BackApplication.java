package kr.co.noorigun.back;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@SpringBootApplication
public class BackApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackApplication.class, args);
	}

	@Bean
	public WebMvcConfigurer crosConfigurer() {
		return new WebMvcConfigurer() {
			@Override
			public void addCorsMappings(CorsRegistry registry) {
				System.out.println("Cros Allow Origin 실행");
				registry.addMapping("/**")
				.allowedOrigins("http://192.168.0.88:3001", "http://192.168.0.88:3000", 
						"http://localhost:3001", "http://localhost:3000")
				.allowedHeaders("*")
				.allowedMethods("*")
				.maxAge(3600);
			}
		};
	}
}
