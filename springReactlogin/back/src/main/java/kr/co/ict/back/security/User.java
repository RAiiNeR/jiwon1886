package kr.co.ict.back.security;

import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "_user")
@SequenceGenerator(name = "user_seq_gen", sequenceName = "user_seq", allocationSize = 1)
//SpringSecurity의 사용자와 권한을 구현하기 위한 Entity는 반드시 UserDetails인터페이스를 구현해야 한다.
//SecurityContextHolder 객체에 등록하거나 얻어와야 하는 자격(interface)를 구현해야 한다.
public class User implements UserDetails{
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "user_seq_gen")
    private Long id;
    private String firstname; //이름
    private String lastname; //성

    @Column(unique = true)
    private String username;
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "VARCHAR2(15) CHECK(ROLE IN ('ADMIN','USER','TEACHER'))")
    private Role role;

    //우클릭 -> 소스작업
    public User(String firstname, String lastname, String username, String password, Role role) {
        this.firstname = firstname;
        this.lastname = lastname;
        this.username = username;
        this.password = password;
        this.role = role;
    }


    //권한 Role.java에 선언한 열거형들. ADMIN, USER ....를 얻어오기 위한 메서드
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role.name()));
    }

    //사용자 아이디를 반환
    @Override
    public String getUsername() {
        return this.username;
    }

    
    //계정이 만료되었는지 여부를 반환하는 메서드.
    //true = 계정만료 아직 안됨!
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }


    //계정이 잠겼냐 안잠겼냐를 반환하는 메서드.
    //true = 안잠겼다.
    @Override
    public boolean isAccountNonLocked() {
        return true;
    }


    //자격증명. 패스워드관련
    //패스워드 기간이 만료되었는지, 안되었는지 여부, 만료가 안됨
    //true = 만료안됨
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }


    //계정이 활성화인지 비활성화인지. 사용할 수 있는지에 대한 메서드
    //true = 사용가능
    @Override
    public boolean isEnabled() {
        return true;
    }


    @Override
    public String getPassword() {
        return this.password;
    }


}
