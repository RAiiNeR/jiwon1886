package kr.co.noorigun.suggestion;

import java.util.List;
import java.util.Map;
import org.apache.ibatis.annotations.Mapper;
import kr.co.noorigun.vo.SuggestionVO;

@Mapper
public interface SuggestionDao {
    // 제안목록 조회
    List<SuggestionVO> list(Map<String, String> map);

    // 세부내용 확인
    SuggestionVO detail(int num);

    // 삭제기능
    void delete(int num);

    // 여러 아이디를 삭제하는 메소드 추가
    void deleteSuggestions(List<Integer> ids);

    // 검색을 바탕으로 맞는 목록 개수 반환
    int counting(String searchValue);

    // 수정기능
    void updateState(Map<String, String> map);

}
