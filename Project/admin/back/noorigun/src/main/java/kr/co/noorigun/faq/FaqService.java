package kr.co.noorigun.faq;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import kr.co.noorigun.vo.FaqVO;

@Service
public class FaqService {

    @Autowired
    private FaqDao faqDao;

    // 추가
    public void add(FaqVO vo) {
        faqDao.add(vo);
    }

    // 페이징 계산
    public Page<FaqVO> list(int page, int size, String searchValue) {
        int begin = (page - 1) * size + 1;
        int end = begin + size - 1;
        Map<String, String> map = new HashMap<>();
        map.put("searchValue", searchValue);
        map.put("begin", String.valueOf(begin));
        map.put("end", String.valueOf(end));
        List<FaqVO> entity = faqDao.list(map);
        int totalContents = faqDao.counting(searchValue);
        return new PageImpl(entity, PageRequest.of(page - 1, size), totalContents);
    }

    // 삭제
    public void delete(int num) {
        faqDao.delete(num);
    }

    // 수정
    public void update(FaqVO vo) {
        faqDao.update(vo);
    }

}
