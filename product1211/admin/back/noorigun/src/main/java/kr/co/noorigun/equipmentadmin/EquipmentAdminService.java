package kr.co.noorigun.equipmentadmin;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import kr.co.noorigun.vo.EquipmentAdminImgVO;
import kr.co.noorigun.vo.EquipmentAdminVO;
import kr.co.noorigun.vo.EquipmentRentalVO;

@Service
public class EquipmentAdminService {
    
    @Autowired
    private EquipmentAdminDao equipmentAdminDao;

    public void decreaseQuantity(int itemId, int quantity) {
        // 비품 조회
        EquipmentAdminVO equipment = equipmentAdminDao.getEquipmentById(itemId);
        if (equipment == null) {
            throw new RuntimeException("비품을 찾을 수 없습니다."); // 비품이 없으면 예외 처리
        }

        // 현재 수량에서 감소시킬 수량을 빼기
        int currentQuantity = equipment.getCnt();
        if (currentQuantity - quantity < 0) {
            throw new RuntimeException("수량이 부족합니다. 현재 수량: " + currentQuantity); // 수량 부족 처리
        }

        // 수량 갱신
        equipment.setCnt(currentQuantity - quantity);

        // 수량이 0이면 상태를 '대여 불가'로 설정
        if (equipment.getCnt() == 0) {
            equipment.setState("대여 불가");
        }

        // 업데이트된 비품 정보 저장
        equipmentAdminDao.update(equipment);
    }



    public void add(EquipmentAdminVO vo, List<EquipmentAdminImgVO> eimgvo) {
        equipmentAdminDao.add(vo); // 게시글 추가
        equipmentAdminDao.addImg(eimgvo); // 이미지 추가
    }

    // 게시글 목록 조회
    public List<EquipmentAdminVO> list() {
        return equipmentAdminDao.list();
    }

    public EquipmentAdminVO detail(int num){
        List<Map<String, Object>> maps = equipmentAdminDao.detail(num);
        EquipmentAdminVO vo = null;
        for (Map<String, Object> map : maps) {
            if (vo == null) {
                vo = new EquipmentAdminVO();
                vo.setNum(Integer.parseInt(String.valueOf(map.get("NUM"))));
                vo.setRname((String) map.get("RNAME"));
                vo.setState((String) map.get("STATE"));
                vo.setCnt(Integer.parseInt(String.valueOf(map.get("CNT"))));   
                vo.setEdate(String.valueOf(map.get("EDATE")));
                vo.setRcnt(Integer.parseInt(String.valueOf(map.get("RCNT")))); // 대여된 수량 세팅
                vo.setImgNames(new ArrayList<>());
            }
            vo.getImgNames().add((String) map.get("IMGNAME"));
        }
        return vo;
    }


    public void delete(int num){
        equipmentAdminDao.delete(num);
    }

    public void deleteChild(int num) {
        equipmentAdminDao.deleteChild(num); // 자식 데이터 삭제
    }

    public void update(EquipmentAdminVO vo, List<EquipmentAdminImgVO> eimgList){
        // 게시글 내용 업데이트
        equipmentAdminDao.update(vo);

        // 기존 이미지 업데이트
        if (eimgList != null && !eimgList.isEmpty()) {
            for (EquipmentAdminImgVO eimgvo : eimgList) {
                equipmentAdminDao.updateImage(eimgvo);
            }
        }
    }
    public void incrementRentedCount(int itemId) {
        equipmentAdminDao.incrementRentedCount(itemId);
    }

    public void insertRental(EquipmentRentalVO rental) {
        // EquipmentAdminDao의 insertRental 메서드를 호출하여 대여 내역을 저장
        equipmentAdminDao.insertRental(rental);
    }

       // 비품 대여 가능 여부 확인
    public boolean isItemAvailable(int itemId) {
        EquipmentAdminVO equipment = equipmentAdminDao.getEquipmentById(itemId);
        if (equipment == null) {
            return false; // 비품이 존재하지 않으면 대여 불가
        }
        // 대여 가능 여부는 총 수량(cnt)에서 대여된 수량(rentedCount)을 뺀 값이 0보다 큰지로 결정
        return equipment.getCnt() > equipment.getRcnt();
    }

    // 비품 대여 처리
    public boolean rentItem(int userId, int itemId) {
        // 1. 대여 가능 여부 확인
        if (!isItemAvailable(itemId)) {
            return false; // 대여 불가
        }

        // 2. 대여된 비품 수량 증가
        equipmentAdminDao.incrementRentedCount(itemId);

        // 3. 대여 내역 저장
        EquipmentRentalVO rental = new EquipmentRentalVO(userId, itemId, LocalDateTime.now());
        equipmentAdminDao.insertRental(rental);

        return true; // 대여 성공
    }

    // EquipmentAdminDao의 getEquipmentById 메서드를 호출하는 메서드 추가
    public EquipmentAdminVO getEquipmentById(int itemId) {
        return equipmentAdminDao.getEquipmentById(itemId);  // Dao 메서드를 서비스에서 호출
    }
}
