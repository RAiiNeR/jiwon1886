package kr.co.noorigun.faq;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api/faq")
public class FaqController {

    @Autowired
    private FaqService faqService;

    // 카테고리별 게시글을 페이징하여 조회
    // FAQ 데이터를 카테고리와 페이지별로 조회

    @GetMapping
    public Page<Faq> getAllBoards(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "") String title,
            @RequestParam(defaultValue = "") String category) {
        return faqService.getAllBoards(title, category, page, size);
    }
}