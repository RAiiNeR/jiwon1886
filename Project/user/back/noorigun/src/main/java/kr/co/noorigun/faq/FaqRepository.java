package kr.co.noorigun.faq;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import io.lettuce.core.dynamic.annotation.Param;

public interface FaqRepository extends JpaRepository<Faq, Long> {

        // 모든 FAQ 데이터를 번호 기준으로 내림차순 정렬하여 반환
        List<Faq> findAllByOrderByNumDesc();

        // 모든 게시글을 번호 내림차순으로 정렬하여 반환
        @Query(value = "SELECT * FROM faq ORDER BY NUM DESC", nativeQuery = true)
        List<Faq> getList();

        // 제목과 카테고리를 조건으로 데이터를 조회 (페이징 처리 포함)
        @Query(value = "SELECT * FROM ( " +
                        "SELECT f.*, ROW_NUMBER() OVER (ORDER BY f.num DESC) AS row_num " +
                        "FROM faq f " +
                        "WHERE (:title IS NULL OR f.title LIKE %:title%) " +
                        "AND (:category IS NULL OR f.category LIKE %:category%)) " +
                        "WHERE row_num BETWEEN :startRow AND :endRow", nativeQuery = true)
        List<Faq> findByTitleAndCategoryContainingOrderByNumDesc(
                        @Param("title") String title,
                        @Param("category") String category,
                        @Param("startRow") int startRow,
                        @Param("endRow") int endRow);

        // 총 게시물 수를 가져오는 메서드
        @Query(value = "SELECT COUNT(*) FROM faq f " +
                        "WHERE (:title IS NULL OR f.title LIKE %:title%) " +
                        "AND (:category IS NULL OR f.category LIKE %:category%)", nativeQuery = true)
        int countByTitleAndCategoryContaining( // 게시물에 맞는 총 개수 가져옴
                        @Param("title") String title,
                        @Param("category") String category);
}
