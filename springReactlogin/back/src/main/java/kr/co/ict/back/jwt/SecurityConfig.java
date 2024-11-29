package kr.co.ict.back.jwt;
import lombok.RequiredArgsConstructor;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

//@EnableWebSecurity: Spring Security 설정을 활성
@EnableWebSecurity
@Configuration
public class SecurityConfig {
    // JWT 토큰을 검증하는 필터
    @Autowired
    private JwtTokenFilter jwtAuthenticationFilter;
    // 사용자 상세 정보를 제공하는 서비스
    @Autowired
    private UserDetailsService userDetailsService;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // 이 메소드는 DaoAuthenticationProvider 객체를 생성하고 구성
    // UserDetailsService와 PasswordEncoder를 설정하여 사용자 인증 정보를 관리한다.
    @Bean
    public DaoAuthenticationProvider daoAuthenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

 
    @Bean
    AuthenticationManager authenticationManager(
            AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    // /api/auth/** 패턴에 해당하는 모든 경로에 대해 보안 요구 사항을 적용하지 않도록 설정
    // HTTP 요청에 대한 보안 필터 체인을 구성
    // CSRF 보호 비활성화: REST API에서는 일반적으로 CSRF 보호가 필요하지 않는다.
    // 폼 로그인 및 HTTP 기본 인증 비활성화: JWT 인증을 사용하므로 필요하지 않는다.
    // 인증 요구 사항 설정: /api/auth/** 경로에 대한 요청은 인증을 요구하지 않도록 설정, 그 외의 모든 요청에 대해서는 인증을 요구
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf((csrf) -> csrf.disable())
                .cors((cors) -> cors.configurationSource(corsConfigurationSource()))
                .formLogin((login) -> login.disable())
                .httpBasic((basic) -> basic.disable())
                .authorizeHttpRequests((auth) -> auth
                        //.requestMatchers("/api/auth/**").permitAll() //api/auth하위만 허용하겠다.
                        .requestMatchers("/**").permitAll() 
                        .anyRequest().authenticated()) // 모든 요청에 대해 인증을 요구
                // JWT 토큰 필터 추가: JwtTokenFilter를 BasicAuthenticationFilter 전에(즉, 인증을 처리하기 전에) 추가하여 JWT 토큰을 검증
                .addFilterBefore(jwtAuthenticationFilter, BasicAuthenticationFilter.class)
                // 세션 정책 설정: SessionCreationPolicy.STATELESS로 설정하여 세션 기반 인증을 사용하지 않도록 한다.
                .sessionManagement((session) -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                // 로그아웃 기능 비활성화: 상태를 유지하지 않는 인증 방식에서는 로그아웃이 필요 없다.
                .logout((logout) -> logout.disable());
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration corsConfiguration = new CorsConfiguration();

        corsConfiguration.setAllowCredentials(true);
        corsConfiguration.setAllowedOrigins(
                List.of("http://localhost:81/back/", "http://192.168.0.39:81/back/", "http://192.168.0.39/","http://localhost:3001/back/", "http://localhost:3001/"));
        //corsConfiguration.setAllowedOrigins(List.of("*"));
        corsConfiguration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        corsConfiguration.setAllowedHeaders(List.of("*"));

        UrlBasedCorsConfigurationSource urlBasedCorsConfigurationSource = new UrlBasedCorsConfigurationSource();
        urlBasedCorsConfigurationSource.registerCorsConfiguration("/**", corsConfiguration);

        return urlBasedCorsConfigurationSource;

    }

}