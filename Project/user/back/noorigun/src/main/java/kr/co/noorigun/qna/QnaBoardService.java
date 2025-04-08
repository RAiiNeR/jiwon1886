package kr.co.noorigun.qna;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Date;
import java.util.List;

@Service
public class QnaBoardService {
    @Autowired
    private QnaBoardRepository qnaBoardRepository;

    // 전체 게시글 최신순으로 조회(모든 게시글 목록)
    public List<QnaBoard> getAllQna() {
        return qnaBoardRepository.findAllByOrderByNumDesc();
    }

    // 검색 기능을 포함한 게시물 조회
    public Page<QnaBoard> getAllQnaBoards(String title, String writer, String content, int page, int size) {

        int startRow = (page - 1) * size + 1;
        int endRow = page * size;
        System.out.println("startRow:" + startRow + ":Page" + page);
        // 검색 조건에 맞는 게시글 조회
        List<QnaBoard> qna = qnaBoardRepository.findByTitleContainingOrderByNumDesc(title, writer, content, startRow, endRow);
        // 검색 조건에 맞는 전체 게시글 수 계산
        int totalElements = qnaBoardRepository.countByTitleContaining(title, writer, content);
        // 페이지 처리 및 반환
        return new PageImpl<>(qna, PageRequest.of(page - 1, size), totalElements);
    }

    // 새로운 Q&A 게시글을 생성
    public QnaBoard createQnaBoard(QnaBoardVO vo) throws IOException {
        QnaBoard qnaBoard = new QnaBoard();
        qnaBoard.setMnum(vo.getMnum());
        qnaBoard.setWriter(vo.getWriter());
        qnaBoard.setTitle(vo.getTitle());
        qnaBoard.setContent(vo.getContent());
        qnaBoard.setHit(0L); // Long 타입 0
        qnaBoard.setQdate(new Date());
        return qnaBoardRepository.save(qnaBoard);
    }

    // 삭제
    public void delete(Long num) {
        QnaBoard board = qnaBoardRepository.findById(num)
                .orElseThrow(() -> new RuntimeException("삭제 실패했습니다."));
        qnaBoardRepository.delete(board);
    }

    // 특정 게시글의 상세 정보를 조회
    public QnaBoard getBoardByNum(Long num) {
        QnaBoard board = qnaBoardRepository.findById(num)
                .orElseThrow(() -> new RuntimeException("상세보기에 실패했습니다."));
        board.setHit(board.getHit() + 1); // 조회수 증가
        qnaBoardRepository.save(board); // 변경사항 저장
        return board;
    }
}
