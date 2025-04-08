package kr.co.noorigun.suggestion;

import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import kr.co.noorigun.vo.SbImgVO;

@Mapper
public interface SbImgDao {
    List<SbImgVO> getListBySbnum(int sbnum);//특정 이미지 목록 조회
    void deleteBySbnum(int sbnum);//게시글과 연결된 이미지 삭제
}
