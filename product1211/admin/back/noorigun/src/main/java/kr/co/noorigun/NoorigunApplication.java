package kr.co.noorigun;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@SpringBootApplication
public class NoorigunApplication {

	public static void main(String[] args) {
		SpringApplication.run(NoorigunApplication.class, args);
	}

	// 서버랑 클라이언트랑 주소가 달라서 crosoringin 이걸 해결해 주기 위한 설정
@Bean
public WebMvcConfigurer crosConfigurer() {
	return new WebMvcConfigurer() {

		@Override
		public void addCorsMappings(CorsRegistry registry) {
			System.out.println("Cros Allow Origin 실행");
			registry.addMapping("/**")
			.allowedOrigins("http://192.168.0.38:3001", "http://192.168.0.38:3000","http://localhost:3001","http://localhost:3000")
			.allowedHeaders("*")
			.allowedMethods("*")
			.maxAge(3600);
		}
	};
}	
}
