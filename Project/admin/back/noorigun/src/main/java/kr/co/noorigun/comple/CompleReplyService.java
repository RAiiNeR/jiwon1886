package kr.co.noorigun.comple;

import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CompleReplyService {
    @Autowired
    private CompleReplyDao compleReplyDao;

    // 특정 게시글에 달린 댓글 삭제
    public void deleteCompleReplies(Long cbnum) {
        compleReplyDao.deleteCompleReplyByBoardNum(cbnum);
    }

    // 댓글 추가
    public void addReply(Map<String, Object> replyData) {
        compleReplyDao.addReply(replyData);
    }

    // 댓글 조회
    public List<Map<String, Object>> getRepliesByBoardId(Long cbnum) {
        return compleReplyDao.getRepliesByBoardId(cbnum);
    }
}
