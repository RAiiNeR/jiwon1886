package kr.co.user.member;

import jakarta.persistence.*;
import kr.co.user.chat.Chat;
import lombok.*;
import java.util.Collection;
import java.util.Date;
import java.util.List;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

@Entity
@Table(name = "MEMBER")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MemberVO implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "member_seq_gen")
    @SequenceGenerator(name = "member_seq_gen", sequenceName = "MEMBER_SEQ", allocationSize = 1)
    private Integer num; // 고유 식별자 (number(10)과 매칭)

    @Column(nullable = false, length = 20, unique = true)
    private String username; // 사용자 아이디

    @Column(nullable = false, length = 150)
    private String pwd; // 사용자 비밀번호

    @Column(nullable = false, length = 50)
    private String name; // 사용자 이름

    @Column(length = 10, nullable = false)
    private String code; // 주민등록번호이자 사업자번호

    @Column(nullable = false, length = 13)
    private String phone;// 사용자 전화번호

    @Column(nullable = false, length = 50, unique = true)
    private String email; // 사용자 이메일(인증사용)

    @Column(nullable = false, length = 15)
    private String role; // 일반사용자이거나 제휴회사

    @Column(name = "SOCIALUSER", nullable = false)
    private Boolean socialUser = false; // (true이면 소셜로그인, false이면 일반로그인)

    @Column(nullable = true, length = 50)
    private String companyName; // 제휴회사이름(일반회원은 null)

    @Column(nullable = true, length = 50)
    private String companyType; // 기업군(선택:숙박, 교통, 기타)

    @Column(nullable = true, length = 50)
    private String intro; // 자기소개란

    @Temporal(TemporalType.DATE)
    @Column(nullable = false)
    private Date mdate = new Date(); // 가입 날짜 (기본값: 현재 날짜)

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "CHATLOG", joinColumns = @JoinColumn(name
            = "MEMBERNUM"))
    private List<Chat> chatlog;

    public MemberVO(String username, String pwd, String name, String code, String phone, String email, String role) {
        this.username = username;
        this.pwd = pwd;
        this.name = name;
        this.code = code;
        this.phone = phone;
        this.email = email;
        this.role = role;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role));
    }

    @Override
    public String getUsername() {
        return this.username;
    }

    @Override
    public String getPassword() {
        return this.pwd;
    }

    // 계정 만료여부 반환, true : 만료안됨
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    // 계정 잠김 여부, true : 안 잠김
    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    // 자격 증명 기간 만료 여부, true : 만료안됨
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    // 계정 활성화 여부, true : 활성화
    @Override
    public boolean isEnabled() {
        return true;
    }
}

