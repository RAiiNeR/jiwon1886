package kr.co.noorigun.suggestion;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import kr.co.noorigun.vo.ScommVO;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/api/scomm")
public class ScommController {
    @Autowired
    private ScommService scommService;

    // 댓글 추가기능
    @PostMapping
    public void add(@RequestBody ScommVO vo) {
        scommService.add(vo);
    }

    // 특정 댓글 가져오는 기능
    @GetMapping("/{sbnum}")
    public List<ScommVO> getAllList(@PathVariable Long sbnum) {
        return scommService.getAllList(sbnum);
    }

    // 선택된 댓글 기준으로 페이지 수 계산(페이징)
    @GetMapping("/{sbnum}/paged")
    public Map<String, Object> getPagedList(
            @PathVariable Long sbnum,
            @RequestParam int page,
            @RequestParam int size) {
        List<ScommVO> comments = scommService.getPagedList(sbnum, page, size);
        int totalComments = scommService.countCommentsBySbnum(sbnum);
        int totalPages = (int) Math.ceil((double) totalComments / size);

        Map<String, Object> response = new HashMap<>();
        response.put("content", comments);
        response.put("totalPages", totalPages);
        return response;
    }

    // 특정 댓글 삭제기능
    @DeleteMapping("/{num}")
    public void deleteBySbnum(@PathVariable Long num) {
        scommService.deleteBySbnum(num);
    }

}
