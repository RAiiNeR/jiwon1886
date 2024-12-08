package kr.co.noori.back.equipment;

import java.util.List;

import org.hibernate.sql.Update;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/rent")
public class EquipmentController {
   @Autowired
   private EquipmentService equipmentService;

   @GetMapping("/mem")
   public List<Member> gettAllMembers() {
    return equipmentService.getAllMember();
   }

   @GetMapping("/equipments")
   public List<Equipment> getAllEquipments() {
       return equipmentService.getAllEquipments();
   }

    // 재고 업데이트 및 예약 대기자에게 알림
    @PostMapping("/equipments/updateStock")
    public ResponseEntity<?> updateStock(@RequestBody EquipmentVO equipmentVO) {
        try {
            // EquipmentVO를 사용하여 재고 업데이트 및 대기자에게 알림 처리
            equipmentService.update(equipmentVO.getRname(), equipmentVO.getCnt());
            return ResponseEntity.ok("재고가 업데이트되었습니다. 대기자에게 알림을 발송하였습니다.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 대여 신청 메서드
    @PostMapping("/renting")
    public ResponseEntity<?> rentEquipment(@RequestBody RentVO rvo) {
        try {
            // 대여 신청 로직 실행
            String result = equipmentService.rentEquipment(
                rvo.getId(),        // 회원 ID
                rvo.getRname(),     // 물품 이름
                rvo.getCnt()        // 대여 수량
            );
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    //예약메서드
    @PostMapping("/reserving")
    public ResponseEntity<?> reserveEquipment(@RequestBody RentVO vo) {
        try {
            String result = equipmentService.reserveEquipment(
                vo.getId(), 
                vo.getRname(),
                vo.getCnt()
            );
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}