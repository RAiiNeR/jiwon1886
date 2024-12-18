package kr.co.noorigun.suggestion;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import kr.co.noorigun.vo.ScommVO;

@Service
public class ScommService {

  @Autowired
  private ScommDao scommDao;

  // 추가기능
  public void add(ScommVO vo) {
    scommDao.add(vo);
  }

  // 목록 조회기능(댓글)
  public List<ScommVO> getAllList(Long sbnum) {
    return scommDao.list(sbnum);
  }

  // 댓글 페이징 처리
  public List<ScommVO> getPagedList(Long sbnum, int page, int size) {
    int startRow = (page - 1) * size;
    int endRow = page * size;
    return scommDao.listBySbnum(sbnum, startRow, endRow);
  }

  // 댓글 갯수 조회
  public int countCommentsBySbnum(Long sbnum) {
    return scommDao.countCommentsBySbnum(sbnum);
  }

  // 댓글만 삭제
  public void delete(Long num) {
    scommDao.delete(num);
  }

  // 게시글에 포함되어 있는 댓글 삭제(게시글 삭제하면 댓글도 삭제)
  public void deleteBySbnum(Long num) {
    scommDao.deleteBySbnum(num);
  }

}
