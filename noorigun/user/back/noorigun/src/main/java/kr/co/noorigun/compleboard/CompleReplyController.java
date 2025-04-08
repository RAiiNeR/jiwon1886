package kr.co.noorigun.compleboard;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
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

    // 특정 게시글에 연관된 댓글 목록 조회
    // cbnum: 댓글이 연결된 게시글 고유 번호
    @GetMapping("/{cbnum}")
    public List<CompleReply> getReplies(@PathVariable Long cbnum){
        return compleReplyService.getRepliesByCompleBoard(cbnum);
    }

    // 새로운 답글 추가
    @PostMapping
    public CompleReply addReply(@RequestBody CompleReply reply){
        return compleReplyService.savReply(reply);// 답글 저장
    }
    
}
