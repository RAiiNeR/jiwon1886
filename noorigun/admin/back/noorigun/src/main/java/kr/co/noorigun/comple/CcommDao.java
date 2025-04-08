package kr.co.noorigun.comple;

import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import kr.co.noorigun.vo.CcommVO;

@Mapper
public interface CcommDao {
    void addComment(CcommVO vo); // 댓글 추가

    List<CcommVO> listComments(@Param("cbnum") Long cbnum); // 특정 게시글의 댓글 목록 가져오기

    List<CcommVO> pagedComments(
            @Param("cbnum") Long cbnum,
            @Param("startRow") int startRow,
            @Param("endRow") int endRow); // 페이징 처리된 댓글 목록 가져오기

    int countCommentsByCbnum(Long cbnum); // 특정 게시글의 댓글 개수 가져오기

    void deleteComment(Long num); // 특정 게시글에 달린 모든 댓글 삭제

    void deleteCommentById(Long num);// 특정 댓글 삭제
}
