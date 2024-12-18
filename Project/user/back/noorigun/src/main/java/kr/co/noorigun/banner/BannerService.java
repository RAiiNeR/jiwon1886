package kr.co.noorigun.banner;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class BannerService {
    @Autowired
    private BannerRepository bannerRepository;

    // List<Banner> 내림차순으로 정렬된 배너 리스트
    public List<Banner> getAllBanners(){ 
        return bannerRepository.findAllByOrderByNumDesc(); // Repository를 호출하여 데이터를 가져옴
    }
}
