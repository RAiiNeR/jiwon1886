package kr.co.noorigun.freeboard;

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
import kr.co.noorigun.vo.FcommVO;

@RestController
@RequestMapping("/api/fcomm")
public class FcommController {

    @Autowired
    private FcommService fcommService;

    // 댓글 추가
    @PostMapping
    public void addComment(@RequestBody FcommVO vo) {
        fcommService.addComment(vo);
    }

    // 해당 게시글의 댓글 조회
    @GetMapping("/{fbnum}")
    public List<FcommVO> getAllComments(@PathVariable Long fbnum) {
        return fcommService.getAllComments(fbnum);
    }

    // 댓글 페이징 처리
    @GetMapping("/{fbnum}/paged")
    public Map<String, Object> getPagedComments(
            @PathVariable Long fbnum,
            @RequestParam int page,
            @RequestParam int size) {

        List<FcommVO> comments = fcommService.getPagedComments(fbnum, page, size);
        int totalComments = fcommService.getTotalComments(fbnum);
        // 전체 댓글수를 한 페이지에 표시될 댓글수로 나누고 올림처리하여 전체페이지 수 계산
        int totalPages = (int) Math.ceil((double) totalComments / size);

        Map<String, Object> response = new HashMap<>();
        response.put("content", comments);
        response.put("totalPages", totalPages);
        return response;
    }

    @DeleteMapping
    public void deleteCommentByFbnum(@RequestParam Long num) {
        fcommService.deleteComment(num);
    }

    // 댓글 삭제기능
    @DeleteMapping("/{num}")
    public void deleteCommentById(@PathVariable Long num) {
        fcommService.deleteCommentById(num);
    }

}
