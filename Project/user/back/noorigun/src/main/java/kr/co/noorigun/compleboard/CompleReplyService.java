package kr.co.noorigun.compleboard;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CompleReplyService {

    @Autowired
    private CompleReplyRepository compleReplyRepository;

    // 특정 게시글 cbnum에 대한 모든 댓글을 조회
    public List<CompleReply> getRepliesByCompleBoard(Long cbnum){
        return compleReplyRepository.findByCbnum(cbnum);
    }

    // 새로운 답글 저장
    public CompleReply savReply(CompleReply reply){
        return compleReplyRepository.save(reply);
    }
    
}
