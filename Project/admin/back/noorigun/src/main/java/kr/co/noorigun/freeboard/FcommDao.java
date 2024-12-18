package kr.co.noorigun.freeboard;

import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import kr.co.noorigun.vo.FcommVO;


@Mapper
public interface FcommDao {

    void addComment(FcommVO vo); // 댓글 추가

    List<FcommVO> listComments(@Param("fbnum") Long fbnum); // 특정 게시글의 댓글 목록 가져오기

    List<FcommVO> pagedComments(
        @Param("fbnum") Long fbnum,
        @Param("startRow") int startRow,
        @Param("endRow") int endRow
    ); // 페이징 처리된 댓글 목록 가져오기

    int countCommentsByFbnum(Long fbnum); // 특정 게시글의 댓글 개수 가져오기

    void deleteComment(Long num); // 게시글에 속한 모든 댓글 삭제

    void deleteCommentById(Long num);// 특정 댓글 삭제
}
