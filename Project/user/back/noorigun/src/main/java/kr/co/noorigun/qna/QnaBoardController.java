package kr.co.noorigun.qna;

import java.io.IOException;
//import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/qnaboard")
public class QnaBoardController {

    @Autowired
    private QnaBoardService qnaBoardService;

    // Q&A 게시글 작성
    @PostMapping
    public ResponseEntity<?> createQnaBoard(QnaBoardVO vo) throws IOException {
        QnaBoard createdQnaBoard = qnaBoardService.createQnaBoard(vo);
        return ResponseEntity.ok().body(createdQnaBoard); // 생성된 게시글 객체 반환
    }

    // Q&A 게시글 목록 조회 (페이징 + 검색 기능)
    @GetMapping
    public Page<QnaBoard> getAllQnaBoard(
        @RequestParam(name = "page", defaultValue = "1") int page,
        @RequestParam(name = "size", defaultValue = "9") int size,
        @RequestParam(name = "title", defaultValue = "") String title,
        @RequestParam(name = "writer", defaultValue = "") String writer,
        @RequestParam(name = "content", defaultValue = "") String content
    ) {
        return qnaBoardService.getAllQnaBoards(title, writer, content, page, size);
    }


    // Q&A 게시글 상세 조회
    @GetMapping("/detail")
    public QnaBoard getQnaBoardByNum(@RequestParam("num") Long num) {
        return qnaBoardService.getBoardByNum(num);
    }

    // Q&A 게시글 삭제
    @DeleteMapping
    public ResponseEntity<?> deleteQnaBoard(@RequestParam("num") Long num) {
        qnaBoardService.delete(num);
        return ResponseEntity.ok().body(num + "번 게시글 삭제 완료");
    }
}