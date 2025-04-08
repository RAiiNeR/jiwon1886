package kr.co.noorigun.qna;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import kr.co.noorigun.vo.QcommVO;

@RestController
@RequestMapping("/api/qcomm")
public class QcommController {
    
    @Autowired
    private QcommService qcommService;

    //댓글 전체 리스트 조회
    @GetMapping
    public List<QcommVO> listQcomm(){
        return qcommService.list();
    }

    //num에 해당하는 댓글 삭제
    @DeleteMapping
     public ResponseEntity<?> deleteQcomm(@RequestParam int num) {
        qcommService.delete(num);
        return ResponseEntity.ok().body("Delete Seuccess");

    }
}
