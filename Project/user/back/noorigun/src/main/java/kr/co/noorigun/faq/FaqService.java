package kr.co.noorigun.faq;

import java.util.List;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;


@Service
public class FaqService {
    @Autowired
    private FaqRepository faqRepository;

    public List<Faq> findAllByOrderByNumDesc() {
        return faqRepository.findAllByOrderByNumDesc();
    }

    // 제목과 내용을 포함하는 게시글을 검색하고 페이징하여 조회
    public Page<Faq> getAllBoards(String title, String category, int page, int size) {
        // startRow와 endRow 계산
        int startRow = (page - 1) * size + 1;
        int endRow = startRow + size - 1;
        System.out.println("시작과 끝=====>" + startRow + "/" + endRow);
        // 제목과 작성자가 비어있을 경우 null로 처리
        title = (title == null || title.trim().isEmpty()) ? null : title;
        category = (category == null || category.trim().isEmpty()) ? null : category;

        // 검색 결과와 총 개수 가져오기
        List<Faq> entity = faqRepository.findByTitleAndCategoryContainingOrderByNumDesc(title, category,
                startRow, endRow);
        System.out.println("리스트 사이즈 : " + entity.size());
        int totalElements = faqRepository.countByTitleAndCategoryContaining(title, category);

        // PageImp을 사용하여 Page 객체로 반환
        return new PageImpl<>(entity, PageRequest.of(page - 1, size), totalElements);
    }
}


