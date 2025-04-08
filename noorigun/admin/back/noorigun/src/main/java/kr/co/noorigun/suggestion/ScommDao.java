package kr.co.noorigun.suggestion;

import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import kr.co.noorigun.vo.ScommVO;

@Mapper
public interface ScommDao {
    // 댓글 추가
    void add(ScommVO vo);

    // 전체 댓글 조회
    List<ScommVO> list(@Param("sbnum") Long sbnum);

    // 페이징 된 댓글 조회
    List<ScommVO> listBySbnum(
            @Param("sbnum") Long sbnum,
            @Param("startRow") int startRow,
            @Param("endRow") int endRow);

    // 특정 게시글의 총 댓글 갯수
    int countCommentsBySbnum(Long sbnum);

    // 특정 댓글 삭제
    void delete(Long num);

    // 게시글 번호에 속한 모든 댓글 삭제
    void deleteBySbnum(Long sbnum);

}
