package kr.co.noorigun.comple;

import java.util.List;
import java.util.Map;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface CompleReplyDao {
    // 특정 게시글의 모든 댓글기능 삭제
    int deleteCompleReplyByBoardNum(Long cbnum);

    // 답변 추가
    void addReply(Map<String, Object> replyData);

    // 특정 게시글의 답변 조회
    List<Map<String, Object>> getRepliesByBoardId(Long cbnum);
}
