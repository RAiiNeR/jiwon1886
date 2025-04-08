package kr.co.test.test.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import kr.co.test.test.service.BoardService;
import kr.co.test.test.vo.BoardVO;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
//get과 post를 전부 불러오는 것이 RequestMapping
@RequestMapping("/api/board") //api뒤에는 페이지의 이름 넣기
public class BoardController {
    @Autowired
    private BoardService boardService;

    @PostMapping
    public ResponseEntity<?> addBoard(BoardVO vo) {
        System.out.println(vo.getWriter() +"/"+vo.getTitle()+vo.getContent());
        boardService.add(vo);
        return ResponseEntity.ok().body(vo); //성공시 body에 vo가 들어감
    }

    @GetMapping
    public List<BoardVO> listBoard() {
        return boardService.list();
    }

    @GetMapping("/detail")
    public BoardVO detailBoard(@RequestParam("num") int num) { //@RequestParam("num") = num이라는 인자값으로 param을 넘기겠다.
        return boardService.detail(num);
    }

    @DeleteMapping
    public ResponseEntity<?> deleteBoard(@RequestParam("num") int num) {
        //url 뒤에 붙은 num값을 Param에 넘겨 해당 num을 삭제한다.
        //기본적으로는 String으로 받는데, RequestParam이 num을 int로 받아오게 한다
        boardService.delete(num);
        return ResponseEntity.ok().body("Delete Success");
    }
}
