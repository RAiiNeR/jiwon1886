package kr.co.noorigun.jwt;

import java.security.Key;
import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import jakarta.servlet.http.HttpServletRequest;
import kr.co.noorigun.manager.ManagerDao;
import kr.co.noorigun.manager.ManagerDto;
import kr.co.noorigun.manager.ManagerService;
import kr.co.noorigun.vo.ManagerVO;
import lombok.extern.slf4j.Slf4j;

/**
 * JWT 토큰 생성 및 검증을 위한 클래스
 */
@Component
@Slf4j
public class JwtTokenProvider {

    @Autowired
    private ManagerService managerService;

    // JWT 서명을 위한 비밀키
    Key key = Keys.secretKeyFor(SignatureAlgorithm.HS512);

    /**
     * 사용자 인증 정보를 기반으로 JWT 토큰 생성
     */
    public String createToken(Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + 3600000); // 1시간 유효

        ManagerDto manager = managerService.getManagerById(userDetails.getUsername()).get();
        String managerName = manager.getName();
        int managerNum = manager.getNum();

        String role = userDetails.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .findFirst().orElse("EMPLOYEE"); // 기본값을 EMPLOYEE로
        // System.out.println("UserDetails => "+userDetails.getUsername()+", "+role);

        return Jwts.builder()
                .setSubject(userDetails.getUsername())
                .claim("num", managerNum)
                .claim("role", role)
                .claim("name", managerName)
                .setIssuedAt(new Date())
                .setExpiration(expiryDate)
                .signWith(key, SignatureAlgorithm.HS512)
                .compact();
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

    public String getRole(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .get("role", String.class);
    }
}