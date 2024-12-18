package kr.co.noorigun.member;

import java.util.Collection;
import java.util.Date;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.SequenceGenerator;
import kr.co.noorigun.compleboard.CompleBoard;
import kr.co.noorigun.program.Registry;
import kr.co.noorigun.qna.QnaBoard;
import kr.co.noorigun.security.Role;
import kr.co.noorigun.suggestion.Suggestion;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
// 회원 엔티티 클래스. Spring Security의 UserDetails를 구현하여 사용자 인증/인가 관련 정보를 제공
@Data
@Getter
@Setter
@Entity
@NoArgsConstructor
public class Member implements UserDetails{
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "member_seq_gen")
    @SequenceGenerator(name = "member_seq_gen", sequenceName = "member_seq", allocationSize = 1)
    private Long num;

    @Column(name = "name", length = 50, nullable = false) // nullable = false , null이 불가능!
    private String name;

    @Column(name = "id", length = 50, nullable = false, unique = true)
    private String id;

    @Column(name = "pwd", nullable = false)
    private String pwd;

    @Column(name = "ssn", nullable = false) 
    private String ssn; // 주민등록번호

    @Column(name = "phone", nullable = false)
    private String phone;

    @Column(name = "email", length = 50, nullable = false, unique = true)
    private String email;
    
    @Column(name = "addr", nullable = false)
    private String addr; // 주소

    @Column(name = "socialuser")
    private String socialuser; // 소셜유저 여부

    // 회원가입 시간이나 회원이 생성된 날짜를 기록하기 위한 필드
    @Column(name = "mdate", nullable = false, columnDefinition = "date default sysdate")
    private Date mdate; // 회원가입 날짜

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "VARCHAR2(15) CHECK(ROLE IN ('ADMIN','USER','STUDENT'))")
    private Role role; // 회원역할(ADMIN, USER, STUDENT)

    @OneToMany(orphanRemoval = true)
    @JoinColumn(name = "mnum")
    @JsonIgnore
    private List<CompleBoard> comples; // 회원이 작성한 완결 게시물 리스트

    @OneToMany(orphanRemoval = true)
    @JoinColumn(name = "mnum")
    @JsonIgnore
    private List<QnaBoard> qnaBoards; // 회원이 작성한 Q&A 게시물 리스트

    @OneToMany(orphanRemoval = true)
    @JoinColumn(name = "mnum")
    @JsonIgnore
    private List<Suggestion> suggestions; // 회원이 작성한 제안 게시물 리스트

    // 회원이 프로그램 신청시 등록되는 정보 ->program이랑 연관있는
    @OneToMany
    @JoinColumn(name = "membernum")
    private List<Registry> registry;

    public Member(String id, String pwd, String ssn, String email, Role role){
        this.name = "테스형";
        this.id = id;
        this.pwd = pwd;
        this.ssn = ssn;
        this.phone = "010-1234-5678";
        this.email = email;
        this.addr = "누리군 누리읍";
        this.mdate = new Date();
        this.role = role;
    }
    // 사용자의 권한을 반환 Spring Security 인증/인가에서 사용
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role.name()));
    }

    @Override
    public String getUsername() {
        return this.id;
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
