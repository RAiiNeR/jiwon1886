package kr.co.admin.jwt;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
/*
 * 로그인 성공 시 클라이언트에 전달할 액세스 토큰 정보를 캡슐화
 * 사용자 인증 요청에 대한 응답 데이터를 담는 DTO 클래스
*/
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {
    private String accessToken; // JWT 액세스 토큰
}
