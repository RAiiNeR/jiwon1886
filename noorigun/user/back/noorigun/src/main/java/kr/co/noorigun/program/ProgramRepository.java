package kr.co.noorigun.program;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProgramRepository extends JpaRepository<Program, Long> {

  List<Program> findAllByOrderByNumDesc(); // DB에 존재하는 객체 찾기

  @Query(value = "SELECT * FROM program ORDER BY NUM DESC", nativeQuery = true)
  List<Program> getList(); // 쿼리를 직접 지정 (리스트에 관한)

  // 검색 및 페이징 처리
  @Query(value = """
      SELECT * FROM (SELECT p.*, ROW_NUMBER() OVER (ORDER BY p.num DESC) as row_num
      FROM program p WHERE p.title LIKE %:title%) WHERE row_num BETWEEN :startRow AND :endRow
      """, nativeQuery = true)
  List<Program> findByContentContainingOrderByNumDesc(@Param("title") String title,
      @Param("startRow") int startRow,
      @Param("endRow") int endRow);

  // 총 게시물수
  @Query(value = "SELECT COUNT(*) FROM program p WHERE p.title LIKE %:title%", nativeQuery = true)
  int countByContentContaining(@Param("title") String title);

  @Query(value = "SELECT * FROM (SELECT * FROM program ORDER BY num DESC) WHERE ROWNUM <= 3", nativeQuery = true)
  List<Program> findTop3Programs(); // 최신 3개의 프로그램을 가져오는 서비스 메서드
}
