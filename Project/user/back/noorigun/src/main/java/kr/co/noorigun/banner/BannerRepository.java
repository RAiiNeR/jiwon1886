package kr.co.noorigun.banner;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface BannerRepository extends JpaRepository<Banner,Long>{
    // 배너 데이터를 번호 기준으로 내림차순 정렬
    List<Banner> findAllByOrderByNumDesc();
}
