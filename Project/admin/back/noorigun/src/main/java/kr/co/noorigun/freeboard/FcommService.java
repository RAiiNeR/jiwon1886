package kr.co.noorigun.freeboard;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import kr.co.noorigun.vo.FcommVO;

@Service
public class FcommService {

   @Autowired
   private FcommDao fcommDao;

   //댓글 추가
   public void addComment(FcommVO vo) {
        fcommDao.addComment(vo);
    }

    //특정 게시글에 담긴 전체 댓글 목록
    public List<FcommVO> getAllComments(Long fbnum) {
        return fcommDao.listComments(fbnum);
    }

    //댓글 페이징 처리
    public List<FcommVO> getPagedComments(Long fbnum, int page, int size) {
        int startRow = (page - 1) * size;
        int endRow = page * size;
        return fcommDao.pagedComments(fbnum, startRow, endRow);
    }

    //전체 댓글 수 조회
    public int getTotalComments(Long fbnum) {
        return fcommDao.countCommentsByFbnum(fbnum);
    }

    //전체 댓글 삭제 기능
    public void deleteComment(Long num) {
        fcommDao.deleteComment(num);
    }

    //특정 댓글 삭제 기능
    public void deleteCommentById(Long num) {
        fcommDao.deleteCommentById(num); 
    }

}
