package kr.co.noorigun.compleboard;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CompleReplyRepository extends JpaRepository<CompleReply, Long> {
    // 특정 게시글 번호 cbnum에 연관된 모든 댓글을 조회
    List<CompleReply> findByCbnum(Long cbnum);
}
