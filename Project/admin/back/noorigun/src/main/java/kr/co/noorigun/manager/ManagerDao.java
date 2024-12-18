package kr.co.noorigun.manager;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.apache.ibatis.annotations.Mapper;

import kr.co.noorigun.vo.ManagerVO;

@Mapper
public interface ManagerDao {
    List<Map<String,String>> getManager(Map<String,String> map);
    int counting(String searchValue);
    Optional<ManagerVO> getManagerById(String id);
    void addManager(ManagerVO vo);
}
