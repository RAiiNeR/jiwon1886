package kr.co.admin;

import java.util.ArrayList;
import java.util.Date;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import kr.co.admin.manager.Manager;
import kr.co.admin.manager.ManagerRepository;
import kr.co.admin.member.MemberVO;
import kr.co.admin.security.Role;

@SpringBootApplication
public class AdminApplication implements CommandLineRunner {

	@Autowired
	private ManagerRepository managerRepository;

	@Autowired
    private PasswordEncoder passwordEncoder;

	public static void main(String[] args) {
		SpringApplication.run(AdminApplication.class, args);
	}

	// 빈으로 등록 - 스프링 컨테이너가 관리할 객체
	@Bean
	public WebMvcConfigurer crosConfigurer() {
		return new WebMvcConfigurer() {
			@Override
			public void addCorsMappings(CorsRegistry registry) {
				System.out.println("Cros Allow Origin 실행");
				registry.addMapping("/**")
						.allowedOrigins("http://localhost:3002", "http://localhost:3002/")
						.allowedHeaders("*")
						.allowCredentials(true)
						.allowedMethods("*")
						.maxAge(3600);
			}
		};
	}

	@Override
	public void run(String... args) throws Exception {
		String encodePass = passwordEncoder.encode("test01");
		createUserIfNotExists("000000001", "이학수", encodePass, "fghj0728@naver.com", "LEEHAKSOO.jpg",Role.CEO);
		createUserIfNotExists("202500001", "최의진", encodePass, "jims1209@naver.com", "CHOEUIJIN.jpg", Role.CEO);
		createUserIfNotExists("202500002", "황보도연", encodePass, "ehfussla123@gmail.com", "HWANGBODOYEON.jpg", Role.CEO);
		createUserIfNotExists("202500003", "장지원", encodePass, "jiwon1886@naver.com", "JANGJIWON.jpg", Role.CEO);
		createUserIfNotExists("202500004", "전준영", encodePass, "202500004@naver.com", "JEONJUNYEONG.jpg", Role.CEO);
		createUserIfNotExists("202500005", "조유경", encodePass, "sed6322@naver.com", "JOYUGYEONG.jpg", Role.CEO);
		createUserIfNotExists("202500006", "이승환", encodePass, "h__qo_op__y@naver.com", "LEESEUNGHWAN.jpg", Role.CEO);
		createUserIfNotExists("202500007", "민다빈", encodePass, "202500007@naver.com", "MINDABIN.jpg", Role.CEO);
	}

	private void createUserIfNotExists(String sabun, String name, String password, String email, String img, Role role) {
		Optional<Manager> existinfUser = managerRepository.findBySabun(sabun);
		if (existinfUser.isEmpty()) {
			Manager entity = new Manager();
			entity.setSabun(sabun);
			entity.setPwd(password);
			entity.setName(name);
			entity.setRole(role);
			entity.setImgname(img);
			entity.setEmail(email);
			entity.setMdate(new Date());
			managerRepository.save(entity);
			System.out.println("User Create: " + sabun);
		} else {
			System.out.println("User Exists: " + sabun);
		}
	}

}
