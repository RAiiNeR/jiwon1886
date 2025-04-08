package kr.co.user;

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

import kr.co.user.member.MemberRepository;
import kr.co.user.member.MemberVO;
import kr.co.user.security.Role;

@SpringBootApplication
public class UserApplication implements CommandLineRunner {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private MemberRepository memberRepository;

    public static void main(String[] args) {
        SpringApplication.run(UserApplication.class, args);
    }

    // 빈으로 등록 - 스프링 컨테이너가 관리할 객체
    @Bean
    public WebMvcConfigurer crosConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                System.out.println("Cros Allow Origin 실행");
                registry.addMapping("/**")
                        .allowedOriginPatterns("http://localhost:3001/", "http://localhost:3001")
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
        createUserIfNotExists("test", encodePass, "000101-3", "test@naver.com", Role.ADMIN);
        createUserIfNotExists("test01", encodePass, "000101-3", "test01@naver.com", Role.USER);
        createUserIfNotExists("test02", encodePass, "000101-3", "test02@naver.com", Role.COALITION);
        createUserIfNotExists("pwless", encodePass, "000101-3", "pwless@naver.com", Role.USER);
        createUserIfNotExists("eeo", encodePass, "000117-3", "pwless1@naver.com", Role.USER);
    }

    private void createUserIfNotExists(String username, String password, String ssn, String email, Role role) {
        Optional<MemberVO> existinfUser = memberRepository.findByUsername(username);
        if (existinfUser.isEmpty()) {
            memberRepository.save(new MemberVO(username, password, "테스형", ssn, "010-1111-2222", email, role.toString()));
            System.out.println("User Create: " + username);
        } else {
            System.out.println("User Exists: " + username);
        }
    }

}
