package kr.co.noorigun.comple;

import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import kr.co.noorigun.vo.CompleBoardVO;

@RestController
@RequestMapping("/api/comple")
public class CompleBoardController {
    @Autowired
    private CompleBoardService compleBoardService;

    @GetMapping // @GetMapping이 2개여서 detail과 구분하려고 아래 detail 경로 추가
    public ResponseEntity<?> listCompleBoard(
            @RequestParam(required = false) String searchType,
            @RequestParam(required = false) String searchValue,
            @RequestParam(defaultValue = "1") int currentPage,
            @RequestParam(defaultValue = "10") int pageSize) {
        try {
            Map<String, Object> result = compleBoardService.list(searchType, searchValue, currentPage, pageSize);
            return ResponseEntity.ok(result); // 결과를 JSON 형태로 반환
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("서버 오류 발생: " + e.getMessage());
        }
    }

    @GetMapping("/detail")
    public CompleBoardVO detailCompleBoard(@RequestParam Long num) { // num이라는 이름으로 넘김(RequestParam)
       CompleBoardVO detail = compleBoardService.detail(num);
        if (detail.getImgNames() != null) {
            detail.setImgNamesList(List.of(detail.getImgNames().split(",")));
        }
       return detail;
    }

    // 게시글 상태 및 부서 수정
    @PutMapping("/update")
    public ResponseEntity<?> updateCompleBoardStateAndDeptno(
            @RequestParam Long num,
            @RequestParam String state,
            @RequestParam Long deptno) {
        try {
            boolean isUpdated = compleBoardService.updateCompleBoardStateAndDeptno(num, state, deptno);
            if (isUpdated) {
                return ResponseEntity.ok("게시글이 성공적으로 수정되었습니다.");
            } else {
                return ResponseEntity.badRequest().body("게시글 수정에 실패했습니다.");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("서버 오류 발생: " + e.getMessage());
        }
    }

    // 삭제 기능
    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteCompleBoard(@RequestParam Long num) {
        compleBoardService.deleteCompleBoard(num);
        return ResponseEntity.ok().body("Delete Success");
    }

    // 전체 통계 데이터 가져오기
    @GetMapping("/chart")
    public List<Map<String, String>> chartData() {
        return compleBoardService.chartData();
    }

    // 해당하는 부서 데이터 가져오기
    @GetMapping("/chart/{deptno}")
    public Map<String, String> detailChart(@PathVariable Long deptno) {
        return compleBoardService.detailChart(deptno);
    }

    @GetMapping("/chart/count")
    public int detailCgetCompleBoardCounthart() {
        return compleBoardService.getCompleBoardCount();
    }
}