package kr.co.noorigun.suggestion;

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
@RequestMapping("/api/scomm")
public class ScommController {
    @Autowired
    private ScommService scommService;

    // 페이징처리
    @GetMapping("/{num}")
    public Page<Scomm> getAllFcomm(
            @PathVariable("num") int num,
            @RequestParam(name = "page", defaultValue = "1") int page,
            @RequestParam(name = "size", defaultValue = "5") int size) {
        return scommService.getAllFcomms(num, page, size);
    }

    // 삭제
    @DeleteMapping
    public ResponseEntity<?> deleteFcomm(@RequestParam("num") Long num) {
        scommService.delete(num);
        return ResponseEntity.ok().body(num + "번째  데이터  삭제  완료");
    }
    //값을 넣는 부분
      @PostMapping
    public Scomm createFcomm(@RequestBody ScommVO vo) {
        return scommService.createFcomm(vo);
    }

}