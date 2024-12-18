package kr.co.noorigun.banner;

import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import kr.co.noorigun.vo.BannerVO;

@Mapper
public interface BannerDao {
    void addBanner(BannerVO vo);// 배너 추가

    List<BannerVO> getList(); // 전체 배너 목록

    void delete(List<Long> num);// 배너 삭제
}
