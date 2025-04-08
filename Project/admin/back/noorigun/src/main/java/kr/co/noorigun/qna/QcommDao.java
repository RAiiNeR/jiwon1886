package kr.co.noorigun.qna;

import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import kr.co.noorigun.vo.QcommVO;


@Mapper
public interface QcommDao {
    List<QcommVO> list();//댓글 조회
    void delete(int num);//삭제
}
