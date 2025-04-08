package kr.co.noorigun.member;

import java.util.Date;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Setter
@Getter
public class MemberVO {
       
    private String name;
    private String id;
    private String pwd;
    private String ssn; // 주민등록번호
    private String phone;
    private String email;
    private String addr;
    private String socialuser;
    private Date mdate;

}
