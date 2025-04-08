package kr.co.noorigun.equipmentadmin.dao;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import kr.co.noorigun.vo.EquipmentImgVO;
import kr.co.noorigun.vo.EquipmentVO;
import kr.co.noorigun.vo.RentVO;
import kr.co.noorigun.vo.ReserveVO;

@Mapper
public interface EquipmentDao {

        void add(EquipmentVO vo);

        List<EquipmentVO> list();

        // 비품 상세 조회 (이미지 포함)
        List<Map<String, Object>> detail(int num);

        // 이미지 추가 메서드
        void addImg(List<EquipmentImgVO> eimgvo);

        // 비품 삭제
        void delete(int num);

        // 자식 데이터 삭제 메서드(이미지)
        void deleteChild(int num);

        // 비품 정보 수정
        void update(EquipmentVO vo);

        // 이미지 업데이트 메서드
        void updateImage(EquipmentImgVO eimgvo);

        // 대여 내역 저장
        void insertRental(RentVO rental);

        // 대여 수량 증가
        void incrementRentedCount(Long itemid);

        // 예약자 리스트 조회
        List<ReserveVO> getReservationList();

        // 예약 내역 저장
        void insertReservation(ReserveVO reserveVO);

        // 특정 비품의 예약 내역 조회
        List<RentVO> getRentalsByItemId(Long itemid);

        // 비품과 해당 비품에 대한 예약 내역을 함께 가져오는 메소드
        List<EquipmentVO> getEquipmentWithRentals(Long itemid);

        // 예약 수량 증가
        void incrementReservedCount(@Param("itemid") Long itemid, @Param("recnt") int recnt);

}
