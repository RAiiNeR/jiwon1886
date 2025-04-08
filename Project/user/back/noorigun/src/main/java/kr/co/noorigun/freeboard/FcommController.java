package kr.co.noorigun.freeboard;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/api/fcomm")
public class FcommController {
    @Autowired
    private FcommService fcommService;

    // 댓글 생성 (entity 댓글 데이터를 포함한 Fcomm 엔티티)
    @PostMapping
    public Fcomm createFcomm(@RequestBody Fcomm entity){
        return fcommService.createFcomm(entity);
    }

    // 특정 게시글의 댓글을 페이징 처리해서 조회
    @GetMapping("/{fbnum}")
    public Page<Fcomm> getAllFcomm(
            @PathVariable Long fbnum,
            @RequestParam(name = "page", defaultValue = "1") int page,
            @RequestParam(name = "size", defaultValue = "10") int size
      )  {
        return fcommService.getAllFcomms(fbnum, page, size);
    }

    // 특정 게시글에 속한 댓글의 총 개수를 반환
    @GetMapping("/count")
    public ResponseEntity<?> getCommentCount(@RequestParam Long fbnum){
        try {
            int count = fcommService.getCommentCount(fbnum);
            return ResponseEntity.ok(count);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("fbnum error");
        }
    }

    // 삭제
    @DeleteMapping
    public ResponseEntity<?> deleteFcomm(@RequestParam("num") Long num) {
        fcommService.delete(num);
        return ResponseEntity.ok().body(num + "번째  데이터  삭제  완료");
    }

}
