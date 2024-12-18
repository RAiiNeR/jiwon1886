package kr.co.noorigun;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import kr.co.noorigun.member.Member;
import kr.co.noorigun.member.MemberRepository;
import kr.co.noorigun.security.Role;

@SpringBootApplication
public class NoorigunApplication implements CommandLineRunner {
	@Autowired
	private PasswordEncoder passwordEncoder;

	@Autowired
	private MemberRepository memberRepository;

	public static void main(String[] args) {
		SpringApplication.run(NoorigunApplication.class, args);

	}

	@Override
	public void run(String... args) throws Exception {
		String encodePass = passwordEncoder.encode("test01");
		createUserIfNotExists("test", encodePass, "000728-3", "test@naver.com", Role.ADMIN);
		createUserIfNotExists("test1", encodePass, "900728-2", "test1@naver.com",Role.ADMIN);
	}

	private void createUserIfNotExists(String username, String password, String ssn, String email, Role role) {
		Optional<Member> existinfUser = memberRepository.findById(username);
		if (existinfUser.isEmpty()) {
			memberRepository.save(new Member(username, password, ssn, email, role));
			System.out.println("User Create: " + username);
		} else {
			System.out.println("User Exists: " + username);
		}
	}

	// 빈으로 등록 - 스프링 컨테이너가 관리할 객체
	@Bean
	public WebMvcConfigurer crosConfigurer() {
		return new WebMvcConfigurer() {
			@Override
			public void addCorsMappings(CorsRegistry registry) {
				System.out.println("Cros Allow Origin 실행");
				registry.addMapping("/**")
						.allowedOrigins("http://192.168.0.88:3001", "http://localhost:3001", "http://localhost:3001/")
						.allowedHeaders("*")
						.allowCredentials(true)
						.allowedMethods("*")
						.maxAge(3600);
			}
		};
	}

}
