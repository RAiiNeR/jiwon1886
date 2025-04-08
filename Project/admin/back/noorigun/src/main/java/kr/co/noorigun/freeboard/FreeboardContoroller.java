package kr.co.noorigun.freeboard;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import kr.co.noorigun.vo.FreeboardVO;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/api/freeboard")
public class FreeboardContoroller {

    @Autowired
    private FreeboardService freeboardService;

    // 자유게시판 페이징 처리
    @GetMapping
    public Page<FreeboardVO> listFreeBoard(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "") String searchValue) {
        return freeboardService.list(page, size, searchValue);
    }

    // 디테일기능
    @GetMapping("/detail")
    public FreeboardVO detailFreeboardVO(@RequestParam int num) {
        return freeboardService.detail(num);
    }

    // 삭제기능
    @DeleteMapping
    public ResponseEntity<?> deleteFreeboard(@RequestParam int num) {
        freeboardService.delete(num);
        return ResponseEntity.ok().body("Delete Seuccess");

    }

}
