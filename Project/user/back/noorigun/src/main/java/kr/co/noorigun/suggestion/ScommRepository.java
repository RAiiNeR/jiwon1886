package kr.co.noorigun.suggestion;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ScommRepository extends JpaRepository<Scomm,Long> {
    List<Scomm> findAllByOrderByNumDesc();

    @Query(value = "SELECT * FROM(SELECT c.*, ROW_NUMBER() OVER(ORDER BY c.num DESC) " +
            " as row_num " +
            "FROM scomm c WHERE SBNUM = :num) WHERE row_num " +
            " BETWEEN :startRow AND :endRow", nativeQuery = true)
    List<Scomm> findByTitleContainingOrderByNumDesc(
            @Param("num") int num,
            @Param("startRow") int startRow,
            @Param("endRow") int endRow);

    // 총 게시물수 알려주는 코드

    @Query(value = "SELECT COUNT(*) FROM scomm c WHERE SBNUM = :num", 
    nativeQuery = true)
    int countByTitleContaining(@Param("num") int num);
}
