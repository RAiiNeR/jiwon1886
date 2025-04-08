package kr.co.noorigun.qna;

import java.util.List;
import java.util.Map;
import org.apache.ibatis.annotations.Mapper;
import kr.co.noorigun.vo.QnaBoardVO;

@Mapper
public interface QnaBoardDao {
    void add(QnaBoardVO vo);// 추가

    List<QnaBoardVO> list(Map<String,String> map);//전체 조회

    QnaBoardVO detail(int num);//세부내용

    void hit(int num);//조회수

    void delete(int num);//삭제
    void deleteReply(int num);

    void update(QnaBoardVO vo);//수정

    int checkReply(int num);//해당하는 글의 답변

    int counting(Map<String,String> map);//게시글의 갯수 
}
