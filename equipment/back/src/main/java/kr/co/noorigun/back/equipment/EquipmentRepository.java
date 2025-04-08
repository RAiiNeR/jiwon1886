package kr.co.noorigun.back.equipment;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface EquipmentRepository extends JpaRepository<Equipment, Long>{

    //재고 조회
    @Query(value = "SELECT * FROM equipment", nativeQuery = true)
    List<Equipment> findAllEquipments();

    //재고가 0인 것들만 조회
    @Query(value = "SELECT * FROM EQUIPMENT WHERE cnt = 0", nativeQuery = true)
    List<Equipment> findZeroEquipments();

    //재고가 1이상인 것들만 조회
    @Query(value = "SELECT * FROM EQUIPMENT WHERE cnt > 0", nativeQuery = true)
    List<Equipment> findEquipments();

}
