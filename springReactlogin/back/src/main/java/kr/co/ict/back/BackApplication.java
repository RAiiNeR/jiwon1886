package kr.co.ict.back;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.password.PasswordEncoder;
import kr.co.ict.back.employees.Employee;
import kr.co.ict.back.employees.EmployeeRepository;
import kr.co.ict.back.security.Role;
import kr.co.ict.back.security.User;
import kr.co.ict.back.security.UserRepository;

//implements CommandLineRunner => 스프링부트가 읽혀질때마다 CommandLineRunner 인터페이스를 구현한 run()이라는 메서드를 수행한다.
@SpringBootApplication
public class BackApplication implements CommandLineRunner{
	@Autowired
	private EmployeeRepository employeeRepository;

	// user테이블에 등록하기 위한 repository -> implements UserDetails를 구현한 User
	@Autowired
	private UserRepository userRepository;

	@Autowired
	private PasswordEncoder passwordEncoder;

	public static void main(String[] args) {
		SpringApplication.run(BackApplication.class, args);
	}

	//이 메서드는 애플리케이션이 완전히 시작된 후에 수행할 초기화 작업(스프링 빈이 완전 생성이 된 후)을 하는 메서드이다.
	@Override
	public void run(String... args) throws Exception {
		// 더미 데이터를 저장하기 위한 용도로 사용해보자
		employeeRepository.save(new Employee("tess", "010-9999-8888", "rimp3719@naver.com", "STUDENT01"));
		//패스워드 인코딩 작업
		String encodePass = passwordEncoder.encode("tess01");

		// 권한에 따른 사용자를 추가
		//userRepository.save(new User("tess", "hong", "xman@gmail.com", encodePass, Role.ADMIN)); //이사람은 관리자인거임
		//userRepository.save(new User("tess2", "hong2", "xman2@gmail.com", encodePass, Role.USER));
		createUserIfNotExists("tess", "hong", "xman@gmail.com", encodePass, Role.ADMIN);
		createUserIfNotExists("tess2", "hong2", "xman2@gmail.com", encodePass, Role.USER);
		createUserIfNotExists("tess1", "hong1", "teacher01@naver.com", encodePass, Role.TEACHER);
	}

	private void createUserIfNotExists(String firstname, String lastname, String username, String password, Role role) {
		Optional<User> existingUser = userRepository.findByUsername(username);

		if (existingUser.isEmpty()) {
			userRepository.save(new User(firstname, lastname, username, password, role)); //isEmpty즉 optional<User>가 비워져있을때만 저장
			System.out.println("User created : " + username);
		} else {
			System.out.println("User already exists : " + username);
		}
	}

}
