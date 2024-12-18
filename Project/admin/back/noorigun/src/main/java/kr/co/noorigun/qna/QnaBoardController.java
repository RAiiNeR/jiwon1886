package kr.co.noorigun.qna;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import kr.co.noorigun.vo.QnaBoardVO;


@RestController
@RequestMapping("/api/qnaboard")
public class QnaBoardController {
    @Autowired
    private QnaBoardService qnaBoardService;

    @PostMapping//게시글 내용 추가
    public ResponseEntity<?> addQnaBoard(QnaBoardVO vo) {
        qnaBoardService.add(vo);
        return ResponseEntity.ok().body(vo); // 성공시 body에 vo가 들어간다
    }

    @GetMapping // @GetMapping이 2개여서 detail과 구분하려고 아래 detail 경로 추가
    public Page<QnaBoardVO> QnaBoard(
        @RequestParam(defaultValue = "1") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(defaultValue = "") String searchType,
        @RequestParam(defaultValue = "") String searchValue
    ) {
        return qnaBoardService.list(page,size,searchType,searchValue); // BoardService에서 list값을 반환
    }

    @GetMapping("/detail") // postman에 detail은 경로 따로 추가(detail 경로를 따로줘서) ->
                           // http://localhost:81/test/api/board/detail?num=1
    public QnaBoardVO detailQnaBoard(@RequestParam int num) { // num이라는 이름으로 넘김(RequestParam)
        return qnaBoardService.detail(num);
    }

    @GetMapping("/checkReply/{num}") //num에 해당하는 게시글 댓글 조회
    public int checkreply(@PathVariable int num) { 
        int re = qnaBoardService.checkReply(num);

        return re;
    }

    @DeleteMapping//게시글 삭제
    public ResponseEntity<?> deleteQnaBoard(@RequestParam int num) {
        qnaBoardService.delete(num);
        return ResponseEntity.ok().body("Delete Success");
    }

    @PutMapping // 수정, 업데이트
    public ResponseEntity<?> updateQnaBoard(QnaBoardVO vo) {
        qnaBoardService.update(vo);
        return ResponseEntity.ok().body(vo);// 업데이트 후 객체를 보여지게
    }
}
