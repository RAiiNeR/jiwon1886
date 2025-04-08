package kr.co.noorigun.vo;

import org.apache.ibatis.type.Alias;
import org.springframework.web.multipart.MultipartFile;

import kr.co.noorigun.security.Role;
import lombok.Getter;
import lombok.Setter;

@Alias("manager")
@Getter
@Setter
public class ManagerVO{
    private int num;
    private String id;
    private String name;
    private Role role;
    private String pwd;
    private String imgname;
    private int deptno;
    private String joineddate;
    private MultipartFile mfile;
}
