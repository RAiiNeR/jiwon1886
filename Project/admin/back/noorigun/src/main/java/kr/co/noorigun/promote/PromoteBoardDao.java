package kr.co.noorigun.promote;

import java.util.List;
import java.util.Map;
import org.apache.ibatis.annotations.Mapper;
import kr.co.noorigun.vo.PB_IMGVO;
import kr.co.noorigun.vo.PromoteBoardVO;

@Mapper
public interface PromoteBoardDao {
    void add(PromoteBoardVO vo);// 홍보 게시글 추가

    List<PromoteBoardVO> list(Map<String,String> map);// 전체 리스트

    int counting(String searchValue); // 게시물 총 개수

    List<Map<String, Object>> detail(int num);// 게시글 디테일

    void delete(int num);// 삭제

    void addImg(List<PB_IMGVO> pbvo); // 이미지 추가 메서드

    void deleteChild(int num); // 자식 데이터 삭제 메서드

    void update(PromoteBoardVO vo);// 수정

    void updateImage(PB_IMGVO pbvo);// 이미지 수정
}
