package kr.co.noorigun.comple;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import kr.co.noorigun.vo.CcommVO;

@RestController
@RequestMapping("/api/ccomm")
public class CcommController {

    @Autowired
    private CcommService ccommService;

    // 댓글 추가
    @PostMapping
    public void addComment(@RequestBody CcommVO vo) {
        ccommService.addComment(vo);
    }

    // 해당 댓글 조회
    @GetMapping("/{cbnum}")
    public List<CcommVO> getAllComments(@PathVariable Long cbnum) {
        return ccommService.getAllComments(cbnum);
    }

    // 댓글 페이징
    @GetMapping("/{cbnum}/paged")
    public Map<String, Object> getPagedComments(
            @PathVariable Long cbnum,
            @RequestParam int page,
            @RequestParam int size) {
        // 댓글 목록 가져오기
        List<CcommVO> comments = ccommService.getPagedComments(cbnum, page, size);
        // 해당 게시글 전체 댓글 수
        int totalComments = ccommService.getTotalComments(cbnum);
        // 전체 페이지 수 계산
        int totalPages = (int) Math.ceil((double) totalComments / size);

        Map<String, Object> response = new HashMap<>();
        response.put("content", comments);
        response.put("totalPages", totalPages);
        return response;
    }

    // 해당 댓글 삭제
    @DeleteMapping("/{num}")
    public void deleteCommentById(@PathVariable Long num) {
        ccommService.deleteCommentById(num);
    }

}
