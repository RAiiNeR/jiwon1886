package kr.co.noori.back.equipment;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/rent")
public class EquipmentController {
   @Autowired
   private EquipmentService equipmentService;

   // 멤버리스트(확인용)
   @GetMapping("/member")
   public List<Member> gettAllMembers() {
    return equipmentService.getAllMember();
   }

   @GetMapping
    public Map<String, Object> getPage(
    @RequestParam(name = "rname", defaultValue = "") String rname,
    @RequestParam(name = "page", defaultValue = "1") int page,
    @RequestParam(name = "size", defaultValue = "10") int size
) {
    Page<Equipment> equipmentPage = equipmentService.getPagination(rname, page, size);

    // totalItems와 페이지 데이터를 반환
    Map<String, Object> response = new HashMap<>();
    response.put("productData", equipmentPage.getContent());
    response.put("totalItems", equipmentPage.getTotalElements());
    response.put("totalPages", equipmentPage.getTotalPages());
    response.put("currentPage", equipmentPage.getNumber() + 1);

    return response;
}
   // 장비 전체 리스트
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

    // 재고 신청
    // @PostMapping("/renting")
    // public ResponseEntity<?> rentEquipment(@RequestBody RentVO rentVO) {
    //     try {
    //         // 대여 신청 처리
    //         String result = equipmentService.rentEquipment(rentVO);
    //         return ResponseEntity.ok(result);
    //     } catch (Exception e) {
    //         return ResponseEntity.badRequest().body(e.getMessage());
    //     }
    // }

    // 대여신청 메서드
    @PostMapping("/renting")
    public ResponseEntity<?> rentEquipment(@RequestBody RentVO rvo) {
        try {
            // 대여 신청 로직 실행
            String result = equipmentService.rent(
                rvo.getId(),   // 회원
                rvo.getRname(),// 물품 이름
                rvo.getCnt()   // 갯수
            );
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}