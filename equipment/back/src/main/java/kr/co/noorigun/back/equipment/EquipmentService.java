package kr.co.noorigun.back.equipment;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class EquipmentService {
    @Autowired
    private EquipmentRepository equipmentRepository;

    public List<Equipment> getAllEquipments() {
        return equipmentRepository.findAll();
    }

     // 물품 대여 처리
     public String rentEquipment(Long equipmentId, int count) {
        // 물품 찾기
        Equipment equipment = equipmentRepository.findById(equipmentId)
                .orElseThrow(() -> new RuntimeException("해당 물품을 찾을 수 없습니다."));

        // 물품의 재고가 0이면 실패
        if (equipment.getCnt() == 0) {
            return "실패: 해당 물품은 재고가 없습니다.";
        }

        // 물품의 재고가 부족한 경우
        if (equipment.getCnt() < count) {
            return "재고가 부족합니다.";
        }

        // 재고 차감
        equipment.setCnt(equipment.getCnt() - count);
        equipmentRepository.save(equipment);

        return "성공: 물품이 성공적으로 대여되었습니다.";
    }
}
