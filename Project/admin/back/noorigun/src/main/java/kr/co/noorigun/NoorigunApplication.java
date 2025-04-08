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

import kr.co.noorigun.manager.ManagerDao;
import kr.co.noorigun.manager.ManagerDto;
import kr.co.noorigun.manager.ManagerService;
import kr.co.noorigun.security.Role;
import kr.co.noorigun.vo.ManagerVO;

@SpringBootApplication
public class NoorigunApplication implements CommandLineRunner{
	@Autowired
	private PasswordEncoder passwordEncoder;

	@Autowired
	private ManagerDao managerDao;
	@Autowired
    private ManagerService managerService;

	public static void main(String[] args) {
		SpringApplication.run(NoorigunApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception {
		String encodePass = passwordEncoder.encode("test01");
		createUserIfNotExists("test", encodePass, Role.ADMIN);
		createUserIfNotExists("test1", encodePass,Role.EMPLOYEE);
	}

	private void createUserIfNotExists(String id, String password, Role role) {
		Optional<ManagerDto> existinfUser = managerService.getManagerById(id);
		if (existinfUser.isEmpty()) {
			managerService.addManager(new ManagerDto(id, password, role));
			System.out.println("User Create: " + id);
		} else {
			System.out.println("User Exists: " + id);
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
				.allowedOrigins("http://192.168.0.88:3002", "http://localhost:3002")
				.allowedHeaders("*")
				.allowedMethods("*")
				.maxAge(3600);
			}
		};
	}


}
