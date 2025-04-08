package kr.co.noorigun.suggestion;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import kr.co.noorigun.suggestion.poll.PollService;
import kr.co.noorigun.vo.SbImgVO;
import kr.co.noorigun.vo.SuggestionVO;

@Service
public class SuggestionService {
    @Autowired // 제안 데이터
    private SuggestionDao suggestionDao;

    @Autowired // 이미지 데이터
    private SbImgDao sbImgDao;

    @Autowired // 댓글 데이터
    private ScommDao scommDao;

    @Autowired // 투표
    private PollService pollService;

    // 제안목록 페이징 처리
    public Page<SuggestionVO> list(int page, int size, String searchValue) {
        int begin = (page - 1) * size + 1;
        int end = begin + size - 1;
        Map<String, String> map = new HashMap<>();
        map.put("searchValue", searchValue);
        map.put("begin", String.valueOf(begin));
        map.put("end", String.valueOf(end));
        List<SuggestionVO> entity = suggestionDao.list(map);
        int totalContents = suggestionDao.counting(searchValue);
        return new PageImpl(entity, PageRequest.of(page - 1, size), totalContents);
    }

    // 제안 세부내용
    public SuggestionVO detail(int num) {
        SuggestionVO vo = suggestionDao.detail(num);
        List<SbImgVO> imgvo = sbImgDao.getListBySbnum(num);
        List<String> imgList = new ArrayList<>();
        for (SbImgVO e : imgvo) {
            imgList.add(e.getImgname());
        }
        vo.setImgNames(imgList);
        return vo;
    }

    // 단일삭제
    // 제안목록 삭제 시 설문조사와 관련된(옵션, 이미지, 댓글, 목록) 모두 삭제
    @Transactional // 여기 중 하나라도 삭제가 되지 않는다면 전체 삭제 취소
    public void delete(int num) {
        pollService.deletePollsAndOptions(Long.parseLong(String.valueOf(num)));
        sbImgDao.deleteBySbnum(num);
        scommDao.delete((long) num);
        suggestionDao.delete(num);
    }

    // 여러항목 삭제
    // 제안목록 리스트 삭제
    public void deleteSuggestions(List<Integer> ids) {
        for (int id : ids) {
            pollService.deletePollsAndOptions(Long.parseLong(String.valueOf(id)));
            sbImgDao.deleteBySbnum(id);
            scommDao.delete((long) id);
            suggestionDao.delete(id);
        }
    }

    // 수정
    public void updateState(Map<String, String> map) {
        suggestionDao.updateState(map);
    }

}
