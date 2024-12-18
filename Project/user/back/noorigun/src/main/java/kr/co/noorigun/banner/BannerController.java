package kr.co.noorigun.banner;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;


@RestController
@RequestMapping("/api/banner")
public class BannerController {
    @Autowired
    private BannerService bannerService; // BannerService 빈을 자동으로 주입

    @GetMapping
    public List<Banner> getAllBanners() {
        return bannerService.getAllBanners(); // 배너 목록 반환
    }
    
}
