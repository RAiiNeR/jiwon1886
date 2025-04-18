package kr.co.noorigun.equipment;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

public interface EquipmentRepository extends JpaRepository<Equipment, Long>{
    Optional<Equipment> findByRname(String rname);

    //대여가능
    @Query(value = "SELECT cnt, rcnt, rname, state FROM equipment WHERE state = '대여가능'", nativeQuery = true)
    List<Equipment> findAvailableEquipments();

    //재고 조회
    @Query(value = "SELECT * FROM equipment", nativeQuery = true)
    List<Equipment> findAllEquipments();

    //전체 게시글 조회
    List<Equipment> findAllByOrderByNumDesc();

    //재고가 0인 것들만 조회
    @Query(value = "SELECT cnt, rcnt, rname, state FROM equipment WHERE cnt = 0", nativeQuery = true)
    List<Equipment> findZeroEquipments();

    //재고가 1이상인 것들만 조회
    @Query(value = "SELECT cnt, rcnt, rname, state FROM equipment WHERE cnt > 0", nativeQuery = true)
    List<Equipment> findEquipments();

    //신청한 만큼 현재 재고에서 차감됨
    @Modifying
    @Transactional
    @Query(value = "UPDATE equipment SET cnt = cnt - :cnt WHERE rname = :rname AND cnt >= :cnt", nativeQuery = true)
    void down(@Param("rname") String rname, @Param("cnt") int cnt);

    //재고가 업데이트됨
    @Modifying
    @Transactional
    @Query(value = "UPDATE equipment SET cnt = cnt + :cnt WHERE rname = :rname", nativeQuery = true)
    void update(@Param("rname") String rname, @Param("cnt") int cnt);


    //페이징처리
    @Query(value = "SELECT num, cnt, rname, state, edate,rcnt FROM (SELECT num,rname,state,cnt,edate,rcnt, ROW_NUMBER() OVER (ORDER BY num DESC) as row_num " +
               " FROM equipment WHERE rname LIKE %:rname%) WHERE row_num BETWEEN :startRow AND :endRow", nativeQuery = true)
    List<Equipment> findWithPaging(@Param("rname") String rname, @Param("startRow") int startRow, @Param("endRow") int endRow);

    // 총 게시물수 알려주는 곳 (역시 동일하게 다 나온다.)
    @Query(value = "SELECT COUNT(*) FROM equipment WHERE rname LIKE %:rname%", nativeQuery = true)
    int countByRnameContaining(@Param("rname") String rname);
}