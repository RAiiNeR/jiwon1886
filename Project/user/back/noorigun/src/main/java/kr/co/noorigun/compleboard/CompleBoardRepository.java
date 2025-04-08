package kr.co.noorigun.compleboard;

import java.util.List;
import java.util.Map;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CompleBoardRepository extends JpaRepository<CompleBoard, Long> {
        List<CompleBoard> findAllByOrderByNumDesc(); // 모든 게시글을 번호 내림차순으로 정렬하여 반환

        // 각 부서의 처리상태 보기
        /*
         * SELECT deptno, (SELECT COUNT(*) FROM compleboard c WHERE c.deptno = d.deptno
         * AND c.state = '처리완료') AS 처리완료,
         * (SELECT COUNT(*) FROM compleboard c WHERE c.deptno =d.deptno AND c.state =
         * '처리중') AS 처리중,
         * (SELECT COUNT(*) FROM compleboard c WHERE c.deptno =d.deptno AND c.state =
         * '미처리') AS 미처리,
         * (SELECT COUNT(*) FROM compleboard c WHERE c.deptno =d.deptno AND c.state =
         * '보류') AS 보류,
         * (SELECT COUNT(*) FROM compleboard c WHERE c.deptno =d.deptno AND c.state =
         * '폐기') AS 폐기 FROM dept d ORDER BY d.deptno
         */
        // 부서별 상태별 게시글 통계를 조회
        @Query(value = "SELECT deptno, dname, (SELECT COUNT(*) FROM compleboard c WHERE c.deptno = d.deptno AND c.state = '완료') AS receipt, "
                        + " (SELECT COUNT(*) FROM compleboard c WHERE c.deptno = d.deptno AND c.state = '처리 중') AS receipting, "
                        + " (SELECT COUNT(*) FROM compleboard c WHERE c.deptno = d.deptno AND c.state = '담당부서 지정') AS designatedept, "
                        + " (SELECT COUNT(*) FROM compleboard c WHERE c.deptno = d.deptno AND c.state = '접수중') AS accepting, "
                        + " (SELECT COUNT(*) FROM compleboard c WHERE c.deptno = d.deptno) AS total"
                        + " FROM dept d WHERE NOT DEPTNO IN (1, 10, 20, 30) ORDER BY d.deptno", nativeQuery = true)
        List<Map<String, String>> findByContainingByState();

        // 특정 부서에 대한 상태별 게시글 통계를 조회
        @Query(value = "SELECT deptno, dname, (SELECT COUNT(*) FROM compleboard c WHERE c.deptno = d.deptno AND c.state = '완료') AS receipt, "
                        + " (SELECT COUNT(*) FROM compleboard c WHERE c.deptno = d.deptno AND c.state = '처리 중') AS receipting, "
                        + " (SELECT COUNT(*) FROM compleboard c WHERE c.deptno = d.deptno AND c.state = '담당부서 지정') AS designatedept, "
                        + " (SELECT COUNT(*) FROM compleboard c WHERE c.deptno = d.deptno AND c.state = '접수중') AS accepting, "
                        + " (SELECT COUNT(*) FROM compleboard c WHERE c.deptno = d.deptno) AS total"
                        + " FROM dept d WHERE NOT DEPTNO IN (1, 10, 20, 30) AND d.DEPTNO = :deptno", nativeQuery = true)
        Map<String, String> findByDeptnoContainingByState(@Param("deptno") Long deptno);

        // 모든 게시글을 번호 내림차순으로 정렬하여 반환
        @Query(value = "SELECT * FROM compleboard ORDER BY NUM DESC", nativeQuery = true)
        List<CompleBoard> getList();

        // findByTitleAndWriterContainingOrderByNumDesc 메서드 사용해서 제목, 작성자가 모두 조건에 맞는 데이터
        // 반환
        @Query(value = "SELECT * FROM (SELECT c.NUM, c.CDATE, c.CONTENT, c.DEPTNO, c.HIT, c.PRIVATE, c.PWD, c.STATE, c.TITLE, c.MNUM, SUBSTR(c.WRITER,0,1)||'**' AS WRITER, " +
                        " ROW_NUMBER() OVER (ORDER BY c.num DESC) as row_num " +
                        "FROM compleboard c WHERE (:title IS NULL OR c.title LIKE %:title%) " +
                        "AND (:writer IS NULL OR c.writer LIKE %:writer%)) " +
                        "WHERE row_num BETWEEN :startRow AND :endRow", nativeQuery = true)
        List<CompleBoard> findByTitleAndWriterContainingOrderByNumDesc(
                        @Param("title") String title,
                        @Param("writer") String writer,
                        @Param("startRow") int startRow,
                        @Param("endRow") int endRow);

        // 페이징 처리를 위해 총 게시물 수를 가져오는데 사용
        @Query(value = "SELECT COUNT(*) FROM compleboard c " +
                        "WHERE (:title IS NULL OR c.title LIKE %:title%) " +
                        "AND (:writer IS NULL OR c.writer LIKE %:writer%)", nativeQuery = true)
        int countByTitleAndWriterContaining( // 게시물에 맞는 총 개수 가져옴
                        @Param("title") String title,
                        @Param("writer") String writer);

}