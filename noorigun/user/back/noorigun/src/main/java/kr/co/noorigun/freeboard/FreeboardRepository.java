package kr.co.noorigun.freeboard;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface FreeboardRepository extends JpaRepository<Freeboard, Long> {
        // 게시글 번호로 정렬된 전체 게시글 조회
        List<Freeboard> findAllByOrderByNumDesc();

        // findByTitleContainingOrderByNumDesc 메서드 사용해서 제목만 조건에 맞는 데이터 반환
        @Query(value = "SELECT * FROM(SELECT b.* , ROW_NUMBER() OVER(ORDER BY b.num DESC) as row_num " +
                        " FROM FREEBOARD b WHERE b.title LIKE %:title%) WHERE row_num  BETWEEN :startRow AND :endRow", nativeQuery = true)
        List<Freeboard> findByTitleContainingOrderByNumDesc(@Param("title") String title,
                        @Param("startRow") int startRow,
                        @Param("endRow") int endRow);

        // 페이징 처리를 위해 총 게시물 수를 가져오는데 사용
        @Query(value = "SELECT COUNT(*) FROM Freeboard f WHERE f.title LIKE %:title%", nativeQuery = true)
        int countByTitleContaining(@Param("title") String title); // 게시물에 맞는 총 개수 가져옴

}
