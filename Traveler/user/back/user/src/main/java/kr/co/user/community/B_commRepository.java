package kr.co.user.community;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface B_commRepository extends JpaRepository<B_comm, Long> {

    // 특정 게시글의 부모 댓글만 최신순으로 조회
    // 부모 댓글: 다른 댓글의 대댓글이 아닌 최상위 댓글을 의미함
    @Query("SELECT b FROM B_comm b WHERE b.backpack.num = :backpackNum AND b.parent IS NULL ORDER BY b.bdate DESC")
    List<B_comm> findTopLevelCommentsByBackpackNum(@Param("backpackNum") Long backpackNum);

    // 특정 부모 댓글에 대한 대댓글을 조회
    @Query("SELECT b FROM B_comm b WHERE b.parent.num = :parentNum ORDER BY b.bdate DESC")
    List<B_comm> findRepliesByParentNum(@Param("parentNum") Long parentNum);

    // 특정 게시글의 댓글 개수 가져오기 (대댓글 포함)
    @Query("SELECT COUNT(b) FROM B_comm b WHERE b.backpack.num = :backpackNum")
    long countByBackpackNum(@Param("backpackNum") Long backpackNum);

    // 부모 댓글을 삭제할 때 하위 대댓글도 삭제
    void deleteByParent(B_comm parent);

}