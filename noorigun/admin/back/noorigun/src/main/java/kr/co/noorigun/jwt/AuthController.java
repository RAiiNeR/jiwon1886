package kr.co.noorigun.jwt;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.web.bind.annotation.PostMapping;


@RestController
@CrossOrigin // CORS 허용
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private AuthenticationManager authenticationManager; // 인증 처리 매니저

    @Autowired
    private JwtTokenProvider jwtTokenProvider; // JWT 토큰 제공 클래스

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody AuthRequest authRequest) {
        System.out.println("AuthRequest username => " + authRequest.getUsername());
        System.out.println("AuthRequest password => " + authRequest.getPassword());
        try {
            // 사용자 인증 시도
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            authRequest.getUsername(),
                            authRequest.getPassword()));
            System.out.println("인증 성공 여부: " + authentication);
            System.out.println("Authentication 호출 후");
            SecurityContextHolder.getContext().setAuthentication(authentication);
            System.out.println("SecurityContextHolder 호출 후");
            // JWT 토큰 생성
            String jwt = jwtTokenProvider.createToken(authentication);
            System.out.println("jwtLog ===============> "+jwt);
            // 인증 성공 시 JWT 토큰 반환
            return ResponseEntity.ok(new AuthResponse(jwt));
        } catch (Exception e) {
            // 인증 실패 시
            System.out.println(e);
            System.out.println("인증 오류");
        }

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new AuthResponse(null));
    }

    // 사용자 로그아웃
    @GetMapping("/logout")    
    public ResponseEntity<?> logoutUser(){
        // SecurityContext를 비워서 로그아웃 처리
        SecurityContextHolder.clearContext();
        System.out.println("Token을 삭제 했습니다.");
        return ResponseEntity.ok("Logout 성공!");
    }

    // 인증 테스트
    @GetMapping("/test")
    public ResponseEntity<?> test(HttpServletRequest request) {
        // 토큰 추출
        String token = jwtTokenProvider.resolveToken(request);
        boolean validateToken = jwtTokenProvider.validateToken(token);
        return ResponseEntity.ok(validateToken);
    }
    
}
