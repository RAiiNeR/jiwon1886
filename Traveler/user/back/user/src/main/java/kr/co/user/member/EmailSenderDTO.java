package kr.co.user.member;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

//2025-02-15 전준영 생성
@Getter
@Setter
@AllArgsConstructor // 멤버변수를 매개변수로 받는 생성자를 자동으로 만들어 준다.
@NoArgsConstructor // 기본생성자
// 이메일 인증을 위한 DTO
public class EmailSenderDTO {
    private String email;
    private String code; // 임시 토큰
}
