package kr.co.test.test.dao;

import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import kr.co.test.test.vo.BoardVO;

@Mapper
public interface BoardDao {
    //crud 각각 생성

    // boardvo 추가
    void add(BoardVO vo);
    // boardvo를 받는 list
    List<BoardVO> list();
    // boardvo를 가지는 detail
    BoardVO detail(int num);
    void hit(int num);
    void delete(int num);
}
