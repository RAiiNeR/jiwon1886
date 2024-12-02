package kr.co.test.test;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@SpringBootApplication
public class TestApplication {

	public static void main(String[] args) {
		SpringApplication.run(TestApplication.class, args);
	}

	//Bean객체로 등록해야함 - SpringContainer가 관리할 객체
	//crossorigin허용하는 메서드
	//클라이언트랑 서버랑 기본적으로 주소가 달라서 그걸 연결해주기 위한 코드이다.
	@Bean
	public WebMvcConfigurer crosConfigurer() {
		return new WebMvcConfigurer() {
			@Override
			public void addCorsMappings(CorsRegistry registry) {
				System.out.println("Cros Allow Origin 실행!"); //bean으로 등록이 되어야 하기 때문에
				registry.addMapping("/**") //아래는 각자 아이피 추가하기
				.allowedOrigins("http://192.168.0.90:3001","http://192.168.0.90:3000",
						"http://localhost:3001","http://localhost:3000")
				.allowedHeaders("*")
				.allowedMethods("*").maxAge(3600); //하나의 세션에 대하여 한시간 유지가 된다
			}
		};
	}
}
