package kr.co.mypage.back.mypage;

import java.util.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Setter
@Getter
@Entity
@Table(name = "member")
@SequenceGenerator(name = "member_seq_gen", sequenceName = "member_seq", initialValue = 1, allocationSize = 1)
public class MyPage {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "member_seq_gen")
    private Long num;
    
    @Column(nullable = false)
    private String id;

    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false)
    private String ssn; //주민등록번호
    
    @Column(nullable = false)
    private String phone;
    
    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String addr; //주소

    @Column(nullable = false)
    private String pwd;

    @Column(name = "mdate", nullable = false, columnDefinition = "date default sysdate")
    private Date mdate;
}
