package kr.co.noorigun.compleboard;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/api/ccomm")
public class CcommController {

    @Autowired
    private CcommService ccommService;

     // 댓글 생성 (entity 댓글 데이터를 포함한 Ccomm 엔티티)
    @PostMapping
    public Ccomm createCcomm(@RequestBody Ccomm entity) {
        return ccommService.createCcomm(entity);
    }

    // 특정 게시글의 댓글을 페이징 처리해서 조회
    @GetMapping("/{cbnum}")
    public Page<Ccomm> getAllBoards(
            @PathVariable Long cbnum,
            @RequestParam(name = "page", defaultValue = "1") int page,
            @RequestParam(name = "size", defaultValue = "9") int size
    // @RequestParam(name = "cbnum",defaultValue = "") Long cbnum
    ) {
        return ccommService.getAllBoards(cbnum, page, size);
    }

    // 특정 게시글에 속한 댓글의 총 개수를 반환
    @GetMapping("/count")
    public ResponseEntity<?> getCommentCount(@RequestParam("cbnum") Long cbnum) {
        try {
            int count = ccommService.getCommentCount(cbnum);
            return ResponseEntity.ok(count);
        } catch (Exception e) {
            System.err.println("Error fetching comment count for cbnum: " + cbnum);
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Invalid request or cbnum not found.");
        }
    }

    // 삭제
    @DeleteMapping
    public ResponseEntity<?> deleteCcomm(@RequestParam("num") Long num) {
        ccommService.delete(num);
        return ResponseEntity.ok().body(num + "번째  데이터  삭제  완료");
    }

}
