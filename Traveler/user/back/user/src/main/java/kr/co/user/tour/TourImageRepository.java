package kr.co.user.tour;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import jakarta.transaction.Transactional;

import java.util.List;

@Repository
public interface TourImageRepository extends JpaRepository<TourImage, Long> {
    List<TourImage> findByTour_Num(Long tourNum);

    @Transactional
    @Modifying
    @Query("DELETE FROM TourImage ti WHERE ti.tour.num = :tourNum")
    void deleteAllByTour_Num(@Param("tourNum") Long tourNum);
}
