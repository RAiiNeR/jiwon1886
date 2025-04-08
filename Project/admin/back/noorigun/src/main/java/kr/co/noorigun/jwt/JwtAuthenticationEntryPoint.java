package kr.co.noorigun.jwt;

import java.io.IOException;

import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.www.BasicAuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * JWT 인증 실패 처리를 위한 클래스
 * BasicAuthenticationEntryPoint를 상속받아 인증 실패 시의 동작을 정의
 */

@Component
public class JwtAuthenticationEntryPoint extends BasicAuthenticationEntryPoint {

    // Bean의 속성이 설정된 후에 호출 - 초기화 용도
    // 인증 실패 시 사용하는 Realm 이름을 설정
    @Override
    public void afterPropertiesSet() {
        setRealmName("JWT Aithentication");
        super.afterPropertiesSet();
    }

    /**
     * 인증 실패 시 호출되는 메서드
     * 401 Unauthorized 응답과 에러 메시지를 클라이언트에게 전송
     */
    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response,
            AuthenticationException authException) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // HTTP 401 상태 설정
        response.setContentType("application/json"); // JSON 형식으로 응답 설정
        response.getWriter().write("{ \"message\": \"" + authException.getMessage() + "\" }");
    }
    
}
