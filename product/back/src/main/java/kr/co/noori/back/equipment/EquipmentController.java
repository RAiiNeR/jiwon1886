package kr.co.noori.back.equipment;

import java.util.List;
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
}