package kr.co.noorigun.manager;

import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.multipart.MultipartFile;

import kr.co.noorigun.security.Role;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ManagerDto implements UserDetails {
    private int num;
    private String id;
    private String name;
    private Role role;
    private String pwd;
    private String imgname;
    private int deptno;
    private String joineddate;
    private MultipartFile mfile;

    public ManagerDto(String id, String pwd, Role role){
        this.name = "테스형";
        this.id = id;
        this.pwd = pwd;
        this.role = role;
        this.imgname = "sample.png";
        this.deptno = 11;
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
