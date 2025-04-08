package kr.co.noorigun.comple;

import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController 
@RequestMapping("/api/comple/reply")
public class CompleReplyController {
    
    @Autowired
    private CompleReplyService compleReplyService;

    // 답변 추가
    @PostMapping("/add")
public String addReply(@RequestBody Map<String, Object> replyData) {
    System.out.println("Received reply data: " + replyData); // 요청 데이터 확인
    try {
        compleReplyService.addReply(replyData);
        return "답변이 성공적으로 등록되었습니다.";
    } catch (Exception e) {
        e.printStackTrace();
        return "답변 등록 중 오류 발생: " + e.getMessage();
    }
}

    // 특정 게시글의 답변 조회
    @GetMapping("/{cbnum}")
public ResponseEntity<List<Map<String, Object>>> getRepliesByBoardId(@PathVariable Long cbnum) {
    try {
        List<Map<String, Object>> replies = compleReplyService.getRepliesByBoardId(cbnum);

        // Raw 데이터 로그 확인
        System.out.println("Replies Raw Data: " + replies);

        return ResponseEntity.ok(replies);
    } catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
}
}