package kr.co.noorigun.back.equipment;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/rent")
public class EquipmentController {
    @Autowired
    private EquipmentService equipmentService;

    @GetMapping("/equipments")
    public List<Equipment> getAllEquipments() {
        return equipmentService.getAllEquipments();
    }

    // 물품 대여 요청
    @PostMapping("/rent")
    public String rentEquipment(@RequestParam Long equipmentId, @RequestParam int count) {
        // EquipmentService에서 대여 처리
        return equipmentService.rentEquipment(equipmentId, count);
    }
}
