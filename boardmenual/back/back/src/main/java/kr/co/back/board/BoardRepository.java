package kr.co.back.board;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface BoardRepository extends JpaRepository<Board,Long>{
    List<Board> findAllByOrderByNumDesc(); //이름으로 규칙을 지정해서 사용하는 법

    //쿼리를 직접적으로 써서 함수와 쿼리를 연결하는 것
    @Query(value = "SELECT * FROM BOARD ORDER BY NUM DESC", nativeQuery = true) //이 쿼리를 실행하도록
    List<Board> getList(); //이 함수가

    //추가
    //검색이랑 페이징처리 해주는애
    @Query(value = "SELECT * FROM(SELECT b.*, ROW_NUMBER() OVER(ORDER BY b.num DESC) as row_num "+
    "FROM board b WHERE b.title LIKE %:title%) WHERE row_num BETWEEN :startRow AND :endRow",
    nativeQuery = true)
    List<Board> findByTitleContainingOrderByNumDesc(@Param("title") String title,
        @Param("startRow") int startRow,
        @Param("endRow") int endRow);

    //총 게시물수 알려주는 애
    @Query(value = "SELECT COUNT(*) FROM board b WHERE b.title LIKE %:title%", nativeQuery = true)
    int countByTitleContaining(@Param("title") String title);
}
