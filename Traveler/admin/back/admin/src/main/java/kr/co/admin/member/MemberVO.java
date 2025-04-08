package kr.co.admin.member;

import java.util.List;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;
import kr.co.admin.chat.Chat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name="MEMBER")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MemberVO {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer num;//고유 식별자

    @Column(nullable = false, length = 20, unique = true)
    private String username;//사용자 아이디

    @Column(nullable = false, length = 150)
    private String pwd;//사용자 비밀번호

    @Column(nullable = false, length = 50)
    private String name;//사용자 이름

    @Column(length = 10)
    private String code;//주민등록번호이자 사업자번호

    @Column(length = 13)
    private String phone;//사용자 전화번호

    @Column(nullable = false, length = 50, unique = true)
    private String email;//사용자 이메일(인증사용)

    @Column(nullable = false, length = 15)
    private String role;//일반사용자이거나 제휴회사 

    @Column(name = "socialuser")
    private Boolean socialUser;//(true이면 소셜로그인, false이면 일반로그인)

    // @Column
    // private Boolean emailVerified = false;//이메일 인증여부(true여야 인증)

    // @Column(length = 6)
    // private String emailVerificationCode;//이메일 인증코드 최대 6자리

    // @Column
    // private Boolean company = false;//일반회원 false, 제휴회사 true

    @Column(length = 50)
    private String companyName;//제휴회사이름(일반회원은 null)   

    @Column(length = 50)
    private String companyType;//기업군(선택:숙박, 교통, 기타)

    // 2025-02-18 마이페이지 자기소개란 컬럼추가 (장지원)
    @Column(length = 50)
    private String intro;

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(
        name = "CHATLOG",
        joinColumns = @JoinColumn(name="MEMBERNUM")
    )
    private List<Chat> chatlog;
}
