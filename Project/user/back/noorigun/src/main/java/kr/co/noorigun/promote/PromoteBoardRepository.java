package kr.co.noorigun.promote;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PromoteBoardRepository extends JpaRepository<PromoteBoard, Long> {
    // 게시글 번호로 정렬된 전체 게시글 조회
    List<PromoteBoard> findAllByOrderByNumDesc();

    @Query(value = "SELECT * FROM PROMOTEBOARD ORDER BY NUM DESC", nativeQuery = true)
    List<PromoteBoard> getList();

    // 검색이랑 페이징처리 해주는 코드
    @Query(value = "SELECT * FROM(SELECT b.*, ROW_NUMBER() OVER(ORDER BY b.num DESC) " +
            " as row_num " + "FROM promoteboard b WHERE b.title LIKE %:title%) WHERE row_num " +
            " BETWEEN :startRow AND :endRow", nativeQuery = true)
    List<PromoteBoard> findByTitleContainingOrderByNumDesc(@Param("title") String title,
            @Param("startRow") int startRow,
            @Param("endRow") int endRow);

    // 총 게시물수 알려주는 코드
    @Query(value = "SELECT COUNT(*) FROM promoteboard b WHERE b.title LIKE %:title%", nativeQuery = true)
    int countByTitleContaining(@Param("title") String title);

}
