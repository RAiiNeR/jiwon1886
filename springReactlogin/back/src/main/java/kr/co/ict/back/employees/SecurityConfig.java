package kr.co.ict.back.employees;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

//@Configuration
//@EnableWebSecurity //이렇게 해야 설정 제어권을 받아올 수 있음. SpringSecurityFilterChain이 자동으로 포함된다.
public class SecurityConfig {
    //시큐리티에서 제공해주는 패스워드 인코딩 암호방식을 설정하는 빈을 등록
    //@Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    /*
     * requestMatchers()의 하위 메서드
     * - hasRole() or hasAnyAuthority() : 특정 권한을 가지는 사용자만 접근할 수 있다
     * - hasIpAddress() : 특정 아이피 주소를 가지는 사용자만 접근할 수 있다.
     * - permiAll() or denyAll() : 접근을 전부 허용, 제한할 수 있다.
     * - anonymous() : 인증되지 않은 사용자가 접근할 수 있다.
     * - authenticated() : 인증된 사용자만 허용
     * - anyRequest() : 모든 요청
     */
    //기본문법
    //@Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception{
        //Cross-Site Request Forgery : 사이트 간 요청 위조 공격에 대한 설정!
        http.csrf(csrf -> csrf.disable())
        .authorizeHttpRequests(
            auth -> auth
            .requestMatchers("/", "/main").permitAll()
            // .requestMatchers("/admin/**").hasRole("ADMIN") --> ROLE_ADMIN형식으로 ROLE_붙여서 등록을 해놔야 사용이 가능
            .requestMatchers("/admin/**").hasAuthority("ADMIN") //우리가 커스터마이징을 한 경우 사용
            .requestMatchers("/api/employees/**").permitAll()
            .anyRequest().authenticated()
        )
        .formLogin(form -> form.loginPage("/login").permitAll())
        .logout(logout -> logout.logoutUrl("/logout").logoutSuccessUrl("/login?logout").permitAll());
        return http.build();

    }
}
