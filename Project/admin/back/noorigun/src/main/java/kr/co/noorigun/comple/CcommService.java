package kr.co.noorigun.comple;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import kr.co.noorigun.vo.CcommVO;

@Service
public class CcommService {
    @Autowired
    private CcommDao ccommDao;

    // 댓글 추가
    public void addComment(CcommVO vo) {
        ccommDao.addComment(vo);
    }

    // 전체 댓글 조회
    public List<CcommVO> getAllComments(Long cbnum) {
        return ccommDao.listComments(cbnum);
    }

    // 댓글 페이징
    public List<CcommVO> getPagedComments(Long cbnum, int page, int size) {
        int startRow = (page - 1) * size;
        int endRow = page * size;
        return ccommDao.pagedComments(cbnum, startRow, endRow);
    }

    // 전체 댓글 수
    public int getTotalComments(Long cbnum) {
        return ccommDao.countCommentsByCbnum(cbnum);
    }

    // 해당하는 게시글의 모든 댓글 삭제
    public void deleteComment(Long num) {
        ccommDao.deleteComment(num);
    }

    // 선택한 특정 댓글 삭제
    public void deleteCommentById(Long num) {
        ccommDao.deleteCommentById(num);
    }
}
