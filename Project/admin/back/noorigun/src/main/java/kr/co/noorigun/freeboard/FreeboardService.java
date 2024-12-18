package kr.co.noorigun.freeboard;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import kr.co.noorigun.vo.FreeboardVO;

@Service
public class FreeboardService {
    @Autowired
    private FreeboardDao freeboardDao;

    // 자유게시판 페이징 처리
    public Page<FreeboardVO> list(int page, int size, String searchValue) {
        int begin = (page - 1) * size + 1;
        int end = begin + size - 1;
        Map<String, String> map = new HashMap<>();
        map.put("searchValue", searchValue);
        map.put("begin", String.valueOf(begin));
        map.put("end", String.valueOf(end));
        List<FreeboardVO> entity = freeboardDao.list(map);
        int totalContents = freeboardDao.counting(searchValue);
        return new PageImpl(entity, PageRequest.of(page - 1, size), totalContents);
    }

    // 선택한 게시판 세부내용
    public FreeboardVO detail(int num) {
        return freeboardDao.detail(num);
    }

    // 선택한 게시판 삭제
    public void delete(int num) {
        freeboardDao.delete(num);
    }

}
