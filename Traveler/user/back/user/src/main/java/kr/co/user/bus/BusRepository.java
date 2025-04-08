package kr.co.user.bus;

import java.util.List;
import java.util.Map;

import org.springframework.data.jpa.repository.JpaRepository;
//2025-02-26수정 최의진
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


public interface BusRepository extends JpaRepository<Bus, Long> {

    // DB에 존재하는 객체
    List<Bus> findAllByOrderByNumDesc();

    // //membernum 리스트
    // List<Bus> findByMembernum(Long membernum);

    @Query(value = "SELECT * FROM bus ORDER BY NUM DESC", nativeQuery = true)
    List<Bus> getBusList(); // 쿼리 직접 지정(리스트에 관한)

        @Query(value = "SELECT b.num, b.departure, b.departureoftime, b.destination, b.destinationoftime, b.sitnum " +
        "FROM bus b WHERE b.membernum = :membernum", nativeQuery = true)
        List<Map<String, Object>> findBusListByMembernum(@Param("membernum") Long membernum);


    // 검색 및 페이징 처리
    @Query(value = """
                  SELECT * FROM (SELECT b.*, ROW_NUMBER() OVER (ORDER BY b.num DESC) as row_num
            FROM bus b WHERE b.departure  LIKE %:departure%) WHERE row_num BETWEEN :startRow AND :endRow
                """, nativeQuery = true)
    List<Bus> findByContentContainingOrderByNumDesc(
        @Param("departure") String departure,
            // @Param("membernum") int membernum,
            @Param("startRow") int startRow,
            @Param("endRow") int endRow);

    @Query(value="SELECT COUNT(*) FROM bus b WHERE b.departure Like %:departure%",nativeQuery = true)
    int countByContentContaining(@Param("departure")String departure);
}
