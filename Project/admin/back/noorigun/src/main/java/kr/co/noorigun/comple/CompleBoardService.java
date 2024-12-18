package kr.co.noorigun.comple;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import kr.co.noorigun.vo.CompleBoardVO;

@Service
public class CompleBoardService {
    @Autowired // 게시판 관련
    private CompleBoardDao compleBoardDao;

    @Autowired // 댓글 관련
    private CcommService ccommService;

    @Autowired // 게시글의 이미지 첨부 관련
    private CBImgService cbImgService;

    @Autowired // 답글 관련
    private CompleReplyService compleReplyService;

    // 페이징 처리
    public Map<String, Object> list(String searchType, String searchValue, int currentPage, int pageSize) {
        Map<String, Object> params = new HashMap<>();
        int startRow = (currentPage - 1) * pageSize + 1;
        int endRow = currentPage * pageSize;

        params.put("searchType", searchType);
        params.put("searchValue", searchValue);
        params.put("startRow", startRow);
        params.put("endRow", endRow);

        List<CompleBoardVO> boardList = compleBoardDao.getCompleBoardList(params);
        int totalCount = compleBoardDao.getCompleBoardTotalCount(params);

        Map<String, Object> result = new HashMap<>();
        result.put("boardList", boardList);
        result.put("totalCount", totalCount);
        // 전체 게시글 수 / 페이지당 게시글 수
        result.put("totalPages", (int) Math.ceil((double) totalCount / pageSize));

        return result;
    }

    // 특정게시글 디테일
    public CompleBoardVO detail(Long num) {
        return compleBoardDao.detail(num);
    }

    public int getCompleBoardCount() {
        return compleBoardDao.getCompleBoardCount();
    }

    @Transactional
    public void deleteCompleBoard(Long num) {
        // 1. CB_IMG 삭제
        System.out.println("cbimg삭제시작");
        cbImgService.deleteCBImgs(num);
        System.out.println("cbimg삭제완료");
        // 2. COMPLE_REPLY 삭제
        System.out.println("reply삭제시작");
        compleReplyService.deleteCompleReplies(num);
        System.out.println("reply삭제완료");
        // 3. CCOMM 삭제
        System.out.println("ccom삭제시작");
        ccommService.deleteComment(num);
        System.out.println("ccom삭제완료");

        // 5. COMPLEBOARD 삭제
        System.out.println("compleboard삭제시작");
        compleBoardDao.deleteCompleBoard(num);
    }

    // 게시글 상태 및 부서 수정
    public boolean updateCompleBoardStateAndDeptno(Long num, String state, Long deptno) {
        int result = compleBoardDao.updateCompleBoardStateAndDeptno(num, state, deptno);
        return result > 0; // 수정 성공 여부 반환
    }

    // 전체통계
    public List<Map<String, String>> chartData() {
        List<Map<String, String>> maps = compleBoardDao.chartData();
        List<Map<String, String>> res = new ArrayList<>();
        for (Map<String, String> map : maps) {
            Map<String, String> m = new HashMap<>();
            for (Map.Entry<String, String> e : map.entrySet()) {
                m.put(e.getKey(), String.valueOf(e.getValue()));
            }
            res.add(m);
        }
        return res;
    }

    // 부서별 통계
    public Map<String, String> detailChart(Long deptno) {
        Map<String, String> cboard = compleBoardDao.detailChart(deptno);
        Map<String, String> resMap = new HashMap<>();
        for (Map.Entry<String, String> e : cboard.entrySet()) {
            resMap.put(e.getKey(), String.valueOf(e.getValue()));
        }
        return resMap;
    }
}
