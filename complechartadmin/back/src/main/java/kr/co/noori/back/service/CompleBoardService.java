package kr.co.noori.back.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import kr.co.noori.back.dao.CompleBoardDao;
import kr.co.noori.back.vo.CompleBoardVO;

@Service
public class CompleBoardService {
    @Autowired
    private CompleBoardDao compleBoardDao;

    //전체통계
    public List<Map<String, String>> list() {
        List<Map<String, String>> maps = compleBoardDao.list();
        List<Map<String, String>> res = new ArrayList<>();
        for (Map<String,String> map : maps) {
            Map<String,String> m = new HashMap<>();
            for (Map.Entry<String,String> e : map.entrySet()) {
                m.put(e.getKey(), String.valueOf(e.getValue()));
            }
            res.add(m);
        }
        return res;
    }

    //부서별 통계
    public List<CompleBoardVO> detail(Long deptno) {
        return compleBoardDao.detail(deptno);
    }
}
