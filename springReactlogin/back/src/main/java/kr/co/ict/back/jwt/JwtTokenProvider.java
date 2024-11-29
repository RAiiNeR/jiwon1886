package kr.co.ict.back.jwt;

import java.security.Key;
import java.util.Date;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import io.jsonwebtoken.security.SignatureException;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j //lombok에서 로깅을 지원해주는 라이브러리
public class JwtTokenProvider {
    Key key = Keys.secretKeyFor(SignatureAlgorithm.HS512);
    /**
     * 사용자 인증 정보를 기반으로 JWT 토큰 생성
     */
    public String createToken(Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + 3600000); // 1시간 유효
        String role = userDetails.getAuthorities().stream()
            .map(GrantedAuthority::getAuthority)
            .findFirst().orElse("USER"); //기본값은 USER
            System.out.println("UserDetails -> " + userDetails.getUsername() + ", " + role);

        //Jwt payLoad에 사용자의 정보를 저장하면 json object로 나온다. --> {sub:"xman@gmail.com"}
        return Jwts.builder()
                .setSubject(userDetails.getUsername())
                .claim("role", role) //특정 값을 추가
                .setIssuedAt(new Date()) //토큰 발급 시점을 현재 시간으로 설정
                .setExpiration(expiryDate) //토큰 만료 시간
                .signWith(key, SignatureAlgorithm.HS512) //토큰에 서명 추가, 비밀 키와 해싱 알고리즘 사용
                .compact(); //토큰의 내용을 압축해서 jwt로 변환해준다. 그럼 json으로 압축해준다.
    }

    /**
     * HTTP 요청에서 Bearer 토큰 추출
     */
    public String resolveToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }

    /**
     * 토큰 유효성 검증
     */
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
            return true;
        } catch (MalformedJwtException ex) {
            log.error("잘못된 JWT 토큰");
        } catch (ExpiredJwtException ex) {
            log.error("만료된 JWT 토큰");
        } catch (UnsupportedJwtException ex) {
            log.error("지원되지 않는 JWT 토큰");
        } catch (IllegalArgumentException ex) {
            log.error("JWT 토큰이 비어있음");
        } catch (SignatureException e) {
            log.error("JWT 서명이 유효하지 않음");
        }
        return false;
    }

    /**
     * 토큰에서 사용자명 추출
     */
    public String getUsername(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    public String getRole(String role) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(role)
                .getBody()
                .get("role", String.class);
    }
}
