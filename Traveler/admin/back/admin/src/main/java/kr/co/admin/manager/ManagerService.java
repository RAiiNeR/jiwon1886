package kr.co.admin.manager;

import java.util.Date;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class ManagerService implements UserDetailsService{

    @Autowired
    private ManagerRepository managerRepository;

    @Autowired
    private LoginlogRepository loginlogRepository;

    public Long countAllManagers() {
        return managerRepository.countAllManagers();
    }

    public Manager getManager(String sabun) {
        Manager entity = managerRepository.findBySabun(sabun).get();
        // Loginlog log = loginlogRepository.findByManager(entity);
        // System.out.println(entity);
        // entity.setLoginlog(log);
        return entity;
    }

    public Loginlog getLoginLog(String sabun) {
        return managerRepository.getLoginLog(sabun, PageRequest.of(0, 1)).getContent().get(0);
    }

    public Manager addManager(Manager entity) {
        return managerRepository.save(entity);
    }

    public String getEmail(String sabun){
        return managerRepository.getEmail(sabun);
    }

    public Loginlog logging(String sabun, String ip, Long adnomal) {
        Manager manager = managerRepository.findBySabun(sabun).get();
        Loginlog log = new Loginlog();
        log.setAccessip(ip);
        log.setManager(manager);
        log.setLdate(new Date());
        log.setAbnormal(adnomal);
        return loginlogRepository.save(log);
    }

    public int getNormalLog(String sabun){
        Manager manager = managerRepository.findBySabun(sabun).get();
        return loginlogRepository.countNormal(manager);
    }

    public int getAbnormalLog(String sabun){
        Manager manager = managerRepository.findBySabun(sabun).get();
        return loginlogRepository.countAbnormal(manager);
    }

    public int getHotkeyLog(String sabun){
        Manager manager = managerRepository.findBySabun(sabun).get();
        return loginlogRepository.countHotkey(manager);
    }

    //2025-03-02 전준영 추가
    @Override
    public UserDetails loadUserByUsername(String username) {
        Manager manager = managerRepository.findBySabun(username)
                .orElseThrow(() -> new UsernameNotFoundException("사용자를 찾을 수 없습니다: " + username));
    
        return new org.springframework.security.core.userdetails.User(
                manager.getSabun(),    // 아이디
                manager.getPwd(),      // 비밀번호
                List.of(new SimpleGrantedAuthority(manager.getRole().name())) // 권한(Role) 설정
        );
    }

        // 특정 관리자 삭제
        public void deleteManager(String sabun) {
            if (!managerRepository.findBySabun(sabun).isPresent()) {
                throw new UsernameNotFoundException("삭제할 관리자를 찾을 수 없습니다: " + sabun);
            }
            managerRepository.dedeleteBySabun(sabun); // Repository에 있는 deleteBySabun 호출
        }
    
        // 전체 관리자 삭제
        public void deleteAllManagers() {
            managerRepository.deleteAllManager(); // Repository에 있는 deleteAllManager 호출
        }
}

