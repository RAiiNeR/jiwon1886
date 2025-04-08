package kr.co.admin.manager;

import org.springframework.web.multipart.MultipartFile;

import kr.co.admin.security.Role;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class ManagerVO {
    private String sabun;
    private String pwd;
    private String name;
    private String email;
    private Role role;
    private MultipartFile img;
}
