package kr.co.ict.back.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

//UserDetailsService 인터페이스를 구현한 클래스
//UserDetails객체를 로드하는 역할을 수행
//사용자의 비밀번호가 일치하는지, 사용자의 어떤 권한을 가지고 있는지 추후에 사용될 서비스이다.
// <중요> Spring Security 기본적으로 UserDetailService구현 Bean을 자동으로 찾아와서 사용한다.******
// 로그인 -> Spring Security 는 AuthenticationManager를 사용하여 인증한다.
//UserDetailsService를 호출하고 구현 객체인 CustomUserDetailService에서
//재정의한 loadUserByUsername을 호출하면 데이터베이스에 사용자의 정보를 userDetail에 담아서 반환한다.
@Configuration
public class CustomUserDetailService implements UserDetailsService{

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        //authenticate()를 호출하면서 내부적으로 loadUserByUsername가 호출된다
        try {
            System.out.println("Authentication authenticate() 호출");
            System.out.println("Optional<User> => " + userRepository.findByUsername(username));
            return userRepository.findByUsername(username).orElseThrow(()-> new Exception("username이 없습니다."));
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        
    }
    
}
