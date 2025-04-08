package kr.co.noorigun.banner;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import kr.co.noorigun.vo.BannerVO;

@Service
public class BannerService {
    @Autowired
    private BannerDao bannerDao;

    // 배너 추가
    public void addBanner(BannerVO vo) {
        bannerDao.addBanner(vo);
    }

    // 전체 배너 리스트
    public List<BannerVO> getList() {
        return bannerDao.getList();
    }

    // 배너 삭제
    public void delete(List<Long> num) {
        bannerDao.delete(num);
    }
}
