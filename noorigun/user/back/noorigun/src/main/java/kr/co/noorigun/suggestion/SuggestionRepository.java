package kr.co.noorigun.suggestion;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface SuggestionRepository extends JpaRepository<Suggestion, Long> {
        // 이름(함수명)으로 규칙 지정
        List<Suggestion> findAllByOrderByNumDesc();

        // 검색 및 페이징 처리 (title,writer,content및 시작과 끝 나오게 하는)
        @Query(value = "SELECT * FROM (SELECT s.*, ROW_NUMBER() OVER (ORDER BY s.num DESC) as row_num " +
                        "FROM SUGGESTION s WHERE s.title LIKE %:title%) WHERE row_num BETWEEN :startRow AND :endRow", nativeQuery = true)
        List<Suggestion> findByTitleContainingOrderByNumDesc(@Param("title") String title,
                        @Param("startRow") int startRow,
                        @Param("endRow") int endRow);

        // 총 게시물수 알려주는 곳 (역시 동일하게 다 나온다.)
        @Query(value = "SELECT COUNT(*) FROM SUGGESTION s where s.title LIKE %:title%", nativeQuery = true)
        int countByTitleContaining(@Param("title") String title);

}
