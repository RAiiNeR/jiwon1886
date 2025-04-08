package kr.co.noorigun.suggestion;

import java.util.Date;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;

@Service
public class SuggestionService {
    @Autowired
    private SuggestionRepository suggestionRepository;

    // 모든 게시글 목록 조회
    public List<Suggestion> getAllSuggestion() {
        return suggestionRepository.findAllByOrderByNumDesc();
    }

    // 제목을 포함하는 게시글을 페이징하여 조회
    public Page<Suggestion> getSuggestionListWithPagination(String title, int page, int size) {
        // 페이지 번호와 크기를 기준으로 시작행과 끝 행 번호를 계산
        int startRow = (page - 1) * size + 1;
        int endRow = startRow + size - 1;
        System.out.println("시작과 끝=====>" + startRow + "/" + endRow);
        List<Suggestion> entity = suggestionRepository.findByTitleContainingOrderByNumDesc(title, startRow, endRow);
        System.out.println("리스트 사이즈 : " + entity.size());
        // 전체 게시글 수 계산 (페이징을 위한)
        int totalElements = suggestionRepository.countByTitleContaining(title);

        // PageImpl을 사용하여 Page 객체로 반환
        return new PageImpl<>(entity, PageRequest.of(page - 1, size), totalElements);
    }

    // 게시글 생성
    public Suggestion createSuggestion(SuggestionVO vo) {
        Suggestion suggestion = new Suggestion();
        suggestion.setMnum(vo.getMnum());
        suggestion.setTitle(vo.getTitle());
        suggestion.setWriter(vo.getWriter());
        suggestion.setContent(vo.getContent());
        suggestion.setHit(0L);
        suggestion.setSdate(new Date());
        suggestion.setImgNames(vo.getImgNames());
        suggestion.setState(vo.getState());
        return suggestionRepository.save(suggestion);
    }

    public Suggestion getSuggestByNum(Long num) {
        Suggestion suggestion = suggestionRepository.findById(num)
                .orElseThrow(() -> new RuntimeException("상세보기 실패했습니다."));
        suggestion.setHit(suggestion.getHit() + 1);
        suggestionRepository.save(suggestion);
        return suggestion;
    }

    // 삭제하는 부분
    public void delete(Long num) {
        Suggestion suggestion = suggestionRepository.findById(num)
                .orElseThrow(() -> new RuntimeException("삭제  실패했습니다."));
        suggestionRepository.delete(suggestion);
    }

    // public Suggestion getBoardWithoutHit(Long num) {
    //     return suggestionRepository.findById(num)
    //             .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));
    // }

    @Transactional // 게시글 수정
    public Suggestion updateCompleBoard(Long num, SuggestionVO updatedBoard) {
        // 기존 게시글 조회
        Suggestion existingBoard = suggestionRepository.findById(num)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 게시글입니다."));

        // 수정 가능한 필드 업데이트
        existingBoard.setTitle(updatedBoard.getTitle());
        existingBoard.setWriter(updatedBoard.getWriter());
        existingBoard.setContent(updatedBoard.getContent());

        // 저장
        return suggestionRepository.save(existingBoard);
    }

}
