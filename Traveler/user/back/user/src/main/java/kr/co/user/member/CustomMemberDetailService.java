package kr.co.user.member;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

/*
 * Spring Security의 인증 프로세스에서 사용되는 사용자 정보를 로드하는 서비스
 * 사용자 이름(username)을 기반으로 데이터베이스에서 사용자 정보를 조회하고 반환
*/
@Configuration
public class CustomMemberDetailService implements UserDetailsService {
    @Autowired
    private MemberRepository memberRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        System.out.println(username);
        try {
            // 인증과정에서 호출
            System.out.println("Authentication authenticate() 호출 되며 내부적으로 loadUserByUsername가 호출");
            // 데이터베이스에서 사용자 정보를 조회
            // System.out.println("Optional<Member> => " + memberRepository.findById(username));
            // 사용자 정보가 존재하면 반환, 없으면 예외 발생
            return memberRepository.findByUsername(username).orElseThrow(() -> new Exception("username이 없습니다."));
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

}