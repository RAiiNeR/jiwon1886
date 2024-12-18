package kr.co.noorigun.vo;

import org.apache.ibatis.type.Alias;

import lombok.Getter;
import lombok.Setter;

@Alias("mem")
@Getter
@Setter
public class MemberVO {
    private int num;
    private String id;
    private String name;
    private String ssn;
    private String phone;
    private String email;
    private String addr;
    private String pwd;
    private String mdate;

    
}
