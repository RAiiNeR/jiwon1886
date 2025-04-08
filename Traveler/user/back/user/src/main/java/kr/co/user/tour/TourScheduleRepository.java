package kr.co.user.tour;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import jakarta.transaction.Transactional;

import java.util.List;

@Repository
public interface TourScheduleRepository extends JpaRepository<TourSchedule, Long> {
    List<TourSchedule> findByTour_Num(Long tourNum);

    @Transactional
    @Modifying
    @Query("DELETE FROM TourSchedule ts WHERE ts.tour.num = :tourNum")
    void deleteAllByTour_Num(@Param("tourNum") Long tourNum);
}
