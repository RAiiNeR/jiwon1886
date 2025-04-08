package kr.co.noorigun.equipmentadmin;


import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import jakarta.servlet.http.HttpServletRequest;
import kr.co.noorigun.vo.EquipmentAdminImgVO;
import kr.co.noorigun.vo.EquipmentAdminVO;
import kr.co.noorigun.vo.EquipmentRentalVO;

@RestController
@RequestMapping("/api/equipment")
public class EquipmentAdminController {
    
    @Autowired
    private EquipmentAdminService equipmentAdminService;

    private final Path uploadDir = Paths.get("/noorigun/uploads").toAbsolutePath().normalize();


        // 비품 수량 감소 API
        @PutMapping("/decrease/{itemId}/{quantity}")
        public ResponseEntity<?> decreaseQuantity(@PathVariable int itemId, @PathVariable int quantity) {
            try {
                // 비품 수량 감소
                equipmentAdminService.decreaseQuantity(itemId, quantity);
                return ResponseEntity.ok("수량이 감소되었습니다.");
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("수량 감소에 실패하였습니다: " + e.getMessage());
            }
        }



    @PostMapping
    public ResponseEntity<?> addEquipment(EquipmentAdminVO vo, HttpServletRequest request) {
        List<MultipartFile> files = vo.getMfiles();
        List<EquipmentAdminImgVO> eimglist = new ArrayList<>();
        
        // 이미지 파일 처리
        for (MultipartFile mf : files) {
            EquipmentAdminImgVO eimgvo = new EquipmentAdminImgVO();
            String oriFn = mf.getOriginalFilename();
            System.out.println("oriFn:" + oriFn);
            try {
                Path destinationFile = uploadDir.resolve(oriFn).normalize();
                Files.copy(mf.getInputStream(), destinationFile);
            } catch (Exception e) {
                e.printStackTrace();
            } finally{
                eimgvo.setImgname(oriFn);
                eimglist.add(eimgvo);
            }
        }
        // vo.setRname("비품명");
        equipmentAdminService.add(vo, eimglist);
        return ResponseEntity.ok().body("Upload Success!");
    
    }
     
    @RequestMapping("/equipmentList")
    public List<EquipmentAdminVO> listEquipment() {
        return equipmentAdminService.list();
    }

    @GetMapping("/detail")
    public EquipmentAdminVO detailEquipment(@RequestParam int num){
        return equipmentAdminService.detail(num);
    }
    
    @PutMapping
    public ResponseEntity<?> updateEquipment(EquipmentAdminVO vo) {
        try {
            List<MultipartFile> files = vo.getMfiles();
            List<EquipmentAdminImgVO> eimglist = new ArrayList<>();

            if(files != null && !files.isEmpty()) {
                for (MultipartFile mf : files) {
                    EquipmentAdminImgVO eimgvo = new EquipmentAdminImgVO();
                    String oriFn = mf.getOriginalFilename();

                    if (oriFn == null || oriFn.isEmpty()) {
                        continue; // 파일 이름이 없는 경우 스킵
                    }
                    System.out.println("oriFn:" + oriFn);
                    try {
                        Path destinationFile = uploadDir.resolve(oriFn).normalize();
                        if(Files.exists(destinationFile)) {
                            Files.delete(destinationFile); // 기존 파일 삭제
                        }
                        Files.copy(mf.getInputStream(), destinationFile);
                    } catch (Exception e) {
                        e.printStackTrace();
                        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                .body("File saving failed for file:" + oriFn);
                    }

                    eimgvo.setImgname(oriFn);
                    eimgvo.setEimgnum(vo.getNum()); // 이미지와 게시글 번호를 연결
                    eimglist.add(eimgvo);
                }
            }

            // 서비스 호출로 업데이트 처리
            equipmentAdminService.update(vo, eimglist);
            return ResponseEntity.ok().body("Update Successful");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Update Failed");
        }
    }

    @DeleteMapping
    public ResponseEntity<?> deleteEquiment(@RequestParam int num) {
        try {
            // 자식 테이블 데이터 삭제
            equipmentAdminService.deleteChild(num);
            // 부모 테이블 데이터 삭제
            equipmentAdminService.delete(num);

            return ResponseEntity.ok().body("Delete Success!");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Delete Failed!");
           
        }
    }

    @GetMapping("/checkRent/{itemId}")
    public ResponseEntity<?> checkAvailability(@PathVariable int itemId) {
        EquipmentAdminVO equipment = equipmentAdminService.getEquipmentById(itemId);
        if (equipment == null) {
            return ResponseEntity.status(404).body("비품을 찾을 수 없습니다");
        }
        if (equipment.getCnt() - equipment.getRcnt() > 0) {
            return ResponseEntity.ok("비품 대여 가능");
        } else {
            return ResponseEntity.status(400).body("대여 가능한 비품이 없습니다");
        }
    }

    // 대여 처리
    @PostMapping("/rent")
    public ResponseEntity<?> rentEquipment(@RequestBody EquipmentRentalVO rentalVO) {
        System.out.println("Received rentalVO: " + rentalVO);
        // 1. 대여 가능 여부 체크
        EquipmentAdminVO equipment = equipmentAdminService.getEquipmentById(rentalVO.getItemId());
        if (equipment == null) {
            return ResponseEntity.status(404).body("비품을 찾을 수 없습니다");
        }
        if (equipment.getCnt() - equipment.getRcnt() <= 0) {
            return ResponseEntity.status(400).body("대여 가능한 비품이 없습니다");
        }

        // 2. 대여 내역 저장
        try {
            equipmentAdminService.insertRental(rentalVO);
  
            // 3. 대여 수량 갱신
            equipmentAdminService.incrementRentedCount(rentalVO.getItemId());

            return ResponseEntity.ok("대여 성공!");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("대여 실패!");
        }
    }
}




