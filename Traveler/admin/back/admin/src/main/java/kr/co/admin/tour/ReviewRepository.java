package kr.co.admin.tour;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByTour_Num(Long tourNum);  // ✅ Tour의 num을 기준으로 조회하도록 수정
    Page<Review> findByTour_Num(Long tourNum, Pageable pageable);  // ✅ 동일하게 수정
    Page<Review> findByTour_NumOrderByCreatedAtDesc(Long tourNum, Pageable pageable);
    long countByTour_Num(Long tourId);
}
