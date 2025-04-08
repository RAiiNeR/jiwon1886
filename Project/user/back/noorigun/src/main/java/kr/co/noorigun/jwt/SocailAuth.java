package kr.co.noorigun.jwt;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor // 기본 생성자 생성
@AllArgsConstructor // 모든 필드를 포함한 생성자 생성
public class SocailAuth {
    private String email; // 사용자 email 
}
