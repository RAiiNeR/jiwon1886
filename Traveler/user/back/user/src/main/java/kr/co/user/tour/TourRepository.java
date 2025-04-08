package kr.co.user.tour;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface TourRepository extends JpaRepository<Tour, Long> {

        @Query("SELECT t FROM Tour t WHERE " +
                        "(:keyword IS NULL OR :keyword = '' OR LOWER(t.name) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
                        "OR LOWER(t.location) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
                        "ORDER BY t.num DESC")
        Page<Tour> searchTours(@Param("keyword") String keyword, Pageable pageable);

        @Query("SELECT t FROM Tour t WHERE t.theme = :theme ORDER BY t.num DESC")
        List<Tour> findTop3ByThemeOrderByNumDesc(@Param("theme") String theme);

        @Modifying
        @Query("UPDATE Tour t SET t.hit = t.hit + 1 WHERE t.num = :tourId")
        void increaseHit(@Param("tourId") Long tourId);

        List<Tour> findByLocation(String location);

        @Query("SELECT t.location, COUNT(t) FROM Tour t GROUP BY t.location")
        List<Object[]> findLocationWithTourCount();

        // ✅ 별점 순 정렬 쿼리 추가
        @Query("SELECT t FROM Tour t LEFT JOIN t.reviews r WHERE " +
                        "(:keyword IS NULL OR :keyword = '' OR LOWER(t.name) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
                        "OR LOWER(t.location) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
                        "GROUP BY t ORDER BY AVG(CAST(r.rating AS DOUBLE)) DESC")
        Page<Tour> searchToursOrderByRatingDesc(@Param("keyword") String keyword, Pageable pageable);

        // ✅ 리뷰 개수 순 정렬 쿼리 (수정 불필요)
        @Query("SELECT t FROM Tour t LEFT JOIN t.reviews r WHERE " +
                        "(:keyword IS NULL OR :keyword = '' OR LOWER(t.name) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
                        "OR LOWER(t.location) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
                        "GROUP BY t ORDER BY COUNT(r) DESC")
        Page<Tour> searchToursOrderByReviewCountDesc(@Param("keyword") String keyword, Pageable pageable);

}
