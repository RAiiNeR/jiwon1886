package kr.co.noorigun.equipmentadmin;

import java.util.List;
import java.util.Map;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Update;
import kr.co.noorigun.vo.EquipmentAdminImgVO;
import kr.co.noorigun.vo.EquipmentAdminVO;
import kr.co.noorigun.vo.EquipmentRentalVO;

@Mapper
public interface EquipmentAdminDao {

        void add(EquipmentAdminVO vo);
        List<EquipmentAdminVO> list();
        // 비품 상세 조회 (이미지 포함)
        List<Map<String, Object>> detail(int num);
        void addImg(List<EquipmentAdminImgVO> eimgvo); // 이미지 추가 메서드
        // 비품 삭제
        void delete(int num);
        void deleteChild(int num);  // 자식 데이터 삭제 메서드(이미지)
        // 비품 정보 수정
        void update(EquipmentAdminVO vo);
        void updateImage(EquipmentAdminImgVO eimgvo); // 이미지 업데이트 메서드

        // 대여 가능 여부 확인 (비품 ID로 조회)
        EquipmentAdminVO getEquipmentById(int itemId);

        // 대여 내역 저장
        void insertRental(EquipmentRentalVO rental);

        // 대여 수량 증가
        void incrementRentedCount(int itemId);
}
