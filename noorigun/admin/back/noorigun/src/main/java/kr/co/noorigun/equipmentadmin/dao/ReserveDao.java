package kr.co.noorigun.equipmentadmin.dao;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import kr.co.noorigun.vo.ReserveVO;

@Mapper
public interface ReserveDao {

    void addReserve(ReserveVO reserveVO); // 예약 내역 저장

    void incrementReservedCount(@Param("itemid") Long itemid, @Param("recnt") int recnt); // 예약 수량 증가

    List<Map<String, Object>> reservelist(); // 예약자 목록 조회
    // List<ReserveVO> getReservationsByItemId(Long itemid); // 특정 비품에 대한 예약 내역 조회
    // void deleteReservation(int reserveId); // 예약 내역 삭제

    // 이메일로 회원 조회
    @Select("SELECT reuid, rname, requip, recnt, remail FROM RESERVE WHERE reuid = #{reuid}")
    ReserveVO findByreuid(String reuid);

}
