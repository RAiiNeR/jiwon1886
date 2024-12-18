package kr.co.noorigun.freeboard;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface FcommRepository extends JpaRepository<Fcomm, Long> {
    // 게시글 번호로 정렬된 전체 게시글 조회
    List<Fcomm> findAllByFbnumOrderByNumDesc(Long fbnum);

    //단순 해당게시글 댓글개수
    @Query(value = "SELECT COUNT(*) FROM fcomm WHERE fbnum=:fbnum", nativeQuery = true)
    int countByFbnum(@Param("fbnum") Long fbnum);

    @Query(value = "SELECT * FROM (SELECT f.*, ROW_NUMBER() OVER (ORDER BY f.num DESC) as row_num " +
    " FROM fcomm f WHERE f.fbnum LIKE %:fbnum%) WHERE row_num BETWEEN :startRow AND :endRow ", nativeQuery = true)
    List<Fcomm> findByFbnumContainingOrderByNumDesc(@Param("fbnum") Long fbnum,
            @Param("startRow") int startRow,
            @Param("endRow") int endRow);

    // 페이징 처리를 위해 총 게시물 수를 가져오는데 사용
    @Query(value = "SELECT COUNT(*) FROM fcomm f WHERE f.fbnum LIKE %:fbnum%", nativeQuery = true)
    int countByFbnumContaining(@Param("fbnum") Long fbnum); // 게시물에 맞는 총 개수 가져옴
}
