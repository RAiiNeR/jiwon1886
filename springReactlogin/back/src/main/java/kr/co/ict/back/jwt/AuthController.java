package kr.co.ict.back.jwt;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    // React의 로그인 폼에서 Json형식으로 username, password를 전송
    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody AuthRequest authRequest) {
        System.out.println("AuthRequest username => " + authRequest.getUsername());
        System.out.println("AuthRequest password => " + authRequest.getPassword());
        try {
            Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken
            (authRequest.getUsername(), authRequest.getPassword()));
            System.out.println("인증 성공 여부 : "+authentication);
            System.out.println("Authentication 호출 후");
            //인증성공시 SecurityContextHolder에 인증 정보를 설정
            SecurityContextHolder.getContext().setAuthentication(authentication);
            System.out.println("Authentication 호출 후");
            //JwtTokenProvider를 사용하여 JWT토큰을 생성
            String jwt = jwtTokenProvider.createToken(authentication);
            System.out.println("jwtLog ===========> " +jwt);
            return ResponseEntity.ok(new AuthResponse(jwt));
        } catch (Exception e) {
            System.out.println("인증오류");
        }
        return ResponseEntity.ok(new AuthResponse(null));
    }

    @GetMapping("/logout")
    public ResponseEntity<?> logoutUser(){
        //React에서는 JWT토큰 방식으로 인증할경우 로컬스토리지에서 삭제만 하면 되고 서버측에서는 당연히 토큰을 삭제해줘야 한다.
        //시큐리티 세션을 삭제
        SecurityContextHolder.clearContext();
        System.out.println("Token 삭제");
        return ResponseEntity.ok("Logout 성공");
    }

    @GetMapping("/test")
    public ResponseEntity<?> test() {
        return ResponseEntity.ok("접근됨 확인");
    }
}
