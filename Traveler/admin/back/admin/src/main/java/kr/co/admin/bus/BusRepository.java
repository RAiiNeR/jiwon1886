package kr.co.admin.bus;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
//2025-02-26 최의진 수정

public interface BusRepository extends JpaRepository<Bus,Long>{
     // DB에 존재하는 객체
    List<Bus> findAllByOrderByNumDesc();

    @Query(value = "SELECT * FROM bus ORDER BY NUM DESC", nativeQuery = true)
    List<Bus> getBusList(); // 쿼리 직접 지정(리스트에 관한)

    // 검색 및 페이징 처리
    @Query(value = """
                  SELECT * FROM (SELECT b.*, ROW_NUMBER() OVER (ORDER BY b.num ASC) as row_num
            FROM bus b WHERE b.departure LIKE %:departure%) WHERE row_num BETWEEN :startRow AND :endRow
                """, nativeQuery = true)
    List<Bus> findByContentContainingOrderByNumDesc(@Param("departure") String departure,
            @Param("startRow") int startRow,
            @Param("endRow") int endRow);

    @Query(value="SELECT COUNT(*) FROM bus b WHERE b.departure Like %:departure%",nativeQuery = true)
    int countByContentContaining(@Param("departure")String departure);
}
