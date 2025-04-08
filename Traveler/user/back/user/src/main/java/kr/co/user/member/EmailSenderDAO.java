package kr.co.user.member;

import java.time.Duration;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Repository;
import lombok.RequiredArgsConstructor;
//2025-02-15 전준영 생성
@RequiredArgsConstructor
@Repository
public class EmailSenderDAO {

    private final StringRedisTemplate stringRedisTemplate;

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