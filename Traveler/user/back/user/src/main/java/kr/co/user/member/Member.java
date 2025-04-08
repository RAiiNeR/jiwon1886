package kr.co.user.member;

import java.util.Date;
import java.util.List;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import kr.co.user.chat.Chat;
import kr.co.user.security.Role;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
//2025-02-15 전준영 생성
@Data
@Getter
@Setter
//@Entity
//@SequenceGenerator(name = "member_seq_gen", sequenceName = "member_seq", initialValue = 1, allocationSize = 1)
public class Member {
    @Id
    @GeneratedValue(generator = "member_seq_gen", strategy = GenerationType.SEQUENCE)
    private Integer num;

    @Column(name = "USERNAME", columnDefinition = "varchar2(15)", nullable = false, unique = true)
    private String userName;

    @Column(name = "PWD", columnDefinition = "varchar2(150)", nullable = false)
    private String pwd;

    @Column(name = "NAME", columnDefinition = "varchar2(50)", nullable = false)
    private String name;

    @Column(name = "CODE", columnDefinition = "varchar2(10)", nullable = false)
    private String code;

    @Column(name = "PHONE", columnDefinition = "varchar2(13)", nullable = false)
    private String phone;

    @Column(name = "EMAIL", columnDefinition = "varchar2(50)", nullable = false, unique = true)
    private String email;

    @Enumerated(EnumType.STRING)
    @Column(name = "ROLE", columnDefinition = "varchar2(15) CHECK(ROLE IN ('ADMIN','USER','COALITION'))")
    private Role role;

    @Column(name = "SOCIALUSER", columnDefinition = "number(1)", nullable = false)
    private Long socialuser;

    @Column(name = "COMPANY", columnDefinition = "number(1)", nullable = false)
    private Long company;

    @Column(name = "MDATE", columnDefinition = "date default sysdate", nullable = false)
    private Date mdate; 

    // 2025-02-18 장지원 마이페이지 자기소개글 컬럼 추가
    @Column(name = "INTRO", columnDefinition = "varchar2(50)", nullable = false)
    private String intro = "내용을 입력하세요.";  // 기본값 설정

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(
        name = "CHATLOG",
        joinColumns = @JoinColumn(name="MEMBERNUM")
    )
    private List<Chat> chatlog;


    public Member(){
        this.name = "테스형";
        this.userName = "test";
        this.pwd = "test1";
        this.code = "000728-3";
        this.phone = "010-1234-5678";
        this.email = "fghj0728@naver.com";
        this.mdate = new Date();
        this.role = Role.USER;
        this.socialuser = 0L;
        this.company = 0L;
    }
}