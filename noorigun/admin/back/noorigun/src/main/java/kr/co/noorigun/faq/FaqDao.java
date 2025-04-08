package kr.co.noorigun.faq;

import java.util.List;
import java.util.Map;
import org.apache.ibatis.annotations.Mapper;
import kr.co.noorigun.vo.FaqVO;

@Mapper
public interface FaqDao {
    void add(FaqVO vo);// 추가

    List<FaqVO> list(Map<String, String> map);// 리스트에서 제목누르면 디테일(answer)도 보임

    void hit(int num);// 조회수 증가

    void delete(int num);// 삭제

    void update(FaqVO vo);// 수정

    int counting(String searchValue);// 전체 수

}
