package kr.co.noori.back.equipment;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface EquipmentRepository extends JpaRepository<Equipment, Long>{
    Optional<Equipment> findByRname(String rname);
    Optional<Equipment> findById(Long id);  // ID로 찾는 메서드 추가

    //재고 조회
    @Query(value = "SELECT * FROM equipment", nativeQuery = true)
    List<Equipment> findAllEquipments();

    //재고가 0인 것들만 조회
    @Query(value = "SELECT * FROM EQUIPMENT WHERE cnt = 0", nativeQuery = true)
    List<Equipment> findZeroEquipments();

    //재고가 1이상인 것들만 조회
    @Query(value = "SELECT * FROM EQUIPMENT WHERE cnt > 0", nativeQuery = true)
    List<Equipment> findEquipments();

    //재고가 업데이트됨
    // @Query(value = "UPDATE EQUIPMENT SET cnt = cnt + :addedStock WHERE id = :id", nativeQuery = true)
    // void updateStock(@Param("id") Long id, @Param("addedStock") int addedStock);
    @Modifying
    @Query(value = "UPDATE equipment SET cnt = cnt + :cnt WHERE rname = :rname", nativeQuery = true)
    void updateStock(@Param("rname") String rname, @Param("cnt") int cnt);
}