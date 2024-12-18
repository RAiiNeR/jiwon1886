package kr.co.noorigun.member;

import java.time.Duration;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Repository;

import lombok.RequiredArgsConstructor;

//spring프레임워크에서 생성자 DI용도로 사용
//final필드와  @NonNull 필드에 대해서만 생성자 매개변수를 사용
@RequiredArgsConstructor
@Repository //데이터 처리(베이스) 즉 DAO에 부여하는 bean어노테이션이다.
public class MailCheckDAO {
    	//반드시 생성자에 의해서 주입을 받겠다.
	private final StringRedisTemplate stringRedisTemplate;
  	//private String msg;
//	public CertificationNumberDAO(StringRedisTemplate stringRedisTemplate) {
//		this.stringRedisTemplate = stringRedisTemplate;
//	}
	//인증번호를 저장 => String authCode 랜덤한 문자열로 저장 4pXegF
	public void saveCertificationNumber(String email, String authCode) {
        stringRedisTemplate.opsForValue().set(email, authCode, Duration.ofSeconds(10000));
    }
     // 이메일 인증번호 가져오기
     public String getCertificationNumber(String email) {
        return stringRedisTemplate.opsForValue().get(email);
    }
    // 이메일 인증번호 삭제
    public void deleteCertificationNumber(String email) {
        stringRedisTemplate.delete(email);
    }

    // 이메일 인증번호 존재 여부
    public boolean hasKey(String email) {
        return stringRedisTemplate.hasKey(email);
    }
	
}