package kr.co.noorigun.faq;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import kr.co.noorigun.vo.FaqVO;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@RequestMapping("/api/faq")
public class FaqController {
    @Autowired
    private FaqService faqService;

    // 게시글 추가
    @PostMapping
    public ResponseEntity<?> addFaq(FaqVO vo) {
        System.out.println("vo 내용물 => " + vo.getTitle() + "/" + vo.getAnswer() + "/" + vo.getCategory());
        faqService.add(vo);
        System.out.println("확인" + vo);
        return ResponseEntity.ok().body(vo);
    }

    // 전체 게시물 페이징
    @GetMapping
    public Page<FaqVO> listFaq(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "") String searchValue) {
        return faqService.list(page, size, searchValue);
    }

    // 삭제
    @DeleteMapping
    public ResponseEntity<?> deleteFaq(@RequestParam int num) {
        faqService.delete(num);
        return ResponseEntity.ok().body("Delete Success");
    }

    @PutMapping // 수정, 업데이트
    public ResponseEntity<?> updateFaq(FaqVO vo) {
        faqService.update(vo);
        return ResponseEntity.ok().body(vo);// 업데이트 후 객체를 보여지게
    }
}
