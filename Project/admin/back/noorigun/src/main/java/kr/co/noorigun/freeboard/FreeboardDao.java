package kr.co.noorigun.freeboard;

import java.util.List;
import java.util.Map;
import org.apache.ibatis.annotations.Mapper;
import kr.co.noorigun.vo.FreeboardVO;

@Mapper
public interface FreeboardDao {

    List<FreeboardVO> list(Map<String,String> map);//자유게시판 전체 목록
    FreeboardVO detail(int num);//자유게시판 세부내용
    void delete(int num);//삭제기능
    int counting(String searchValue);//전체 게시글 수 
}
