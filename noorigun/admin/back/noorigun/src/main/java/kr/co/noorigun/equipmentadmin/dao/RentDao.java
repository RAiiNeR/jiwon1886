package kr.co.noorigun.equipmentadmin.dao;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import kr.co.noorigun.vo.EquipmentVO;

@Mapper
public interface RentDao {

    // void insertRental(RentVO rental); // 대여 내역 저장

    void incrementRentedCount(Long itemid); // 대여 수량 증가

    // void deleteRental(int rentalId); // 대여 내역 삭제

    // // 특정 사용자의 대여 내역 조회
    // List<RentVO> getRentalsByUserId(Long userid);

    // // 특정 비품의 대여 내역 조회
    // List<RentVO> getRentalsByItemId(Long itemid);

    // 모든 대여 내역 조회
    List<Map<String, Object>> getAllRentals();

    // 대여 가능 여부 확인 (비품 ID로 조회) 이메일 관련
    EquipmentVO getEquipmentById(Long itemid);
}
