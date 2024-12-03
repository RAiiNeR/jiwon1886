package kr.co.mypage.back.mypage;

import java.util.Date;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Setter
@Getter
public class MyPageVO {
    private Long num;
    private String id;
    private String name;
    private String ssn;
    private String phone;
    private String email;
    private String addr; //주소
    private String pwd;
    private Date mdate;
}