package kr.co.noorigun.manager;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import kr.co.noorigun.vo.ManagerVO;

@Configuration
@Service
public class ManagerService implements UserDetailsService {
    @Autowired
    private ManagerDao managerDao;

    public Page<Map<String,String>> getManager(int page, int size, String searchValue){
        int begin = (page - 1) * size + 1;
        int end = begin + size - 1;
        Map<String, String> map = new HashMap<>();
        map.put("searchValue", searchValue);
        map.put("begin", String.valueOf(begin));
        map.put("end", String.valueOf(end));
        List<Map<String,String>> entity = managerDao.getManager(map);
        int total = managerDao.counting(searchValue);
        return new PageImpl<>(entity, PageRequest.of(page - 1, size), total);  
    }

    public Optional<ManagerDto> getManagerById(String id) {
        Optional<ManagerDto> res = Optional.empty();
        Optional<ManagerVO> entity = managerDao.getManagerById(id);
        if (entity.isEmpty()) {
            return res;
        } else {
            ManagerVO vo = entity.get();
            ManagerDto dto = new ManagerDto();
            dto.setDeptno(vo.getDeptno());
            dto.setId(vo.getId());
            dto.setImgname(vo.getImgname());
            dto.setJoineddate(vo.getJoineddate());
            dto.setName(vo.getName());
            dto.setNum(vo.getNum());
            dto.setPwd(vo.getPwd());
            dto.setRole(vo.getRole());
            res = Optional.of(dto);
            return res;
        }
    }

    public void addManager(ManagerDto dto) {
        ManagerVO vo = new ManagerVO();
        vo.setDeptno(dto.getDeptno());
        vo.setId(dto.getId());
        vo.setImgname(dto.getImgname());
        vo.setName(dto.getName());
        vo.setPwd(dto.getPwd());
        vo.setRole(dto.getRole());
        managerDao.addManager(vo);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        try {
            // 인증과정에서 호출
            System.out.println("Authentication authenticate() 호출 되며 내부적으로 loadUserByUsername가 호출");
            // 데이터베이스에서 사용자 정보를 조회
            System.out.println("Optional<User> => " + managerDao.getManagerById(username));
            // 사용자 정보가 존재하면 반환, 없으면 예외 발생
            return getManagerById(username).orElseThrow(() -> new Exception("username이 없습니다."));
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
