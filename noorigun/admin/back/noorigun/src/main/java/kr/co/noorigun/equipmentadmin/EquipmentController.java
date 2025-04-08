package kr.co.noorigun.equipmentadmin;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import jakarta.servlet.http.HttpServletRequest;
import kr.co.noorigun.vo.EquipmentImgVO;
import kr.co.noorigun.vo.EquipmentVO;

@RestController
@RequestMapping("/api/equipment")
public class EquipmentController {

    @Autowired
    private EquipmentService equipmentService;

    private final Path uploadDir = Paths.get("noorigun/uploads").toAbsolutePath().normalize();

    // 비품 추가 메서드
    @PostMapping
    public ResponseEntity<?> addEquipment(EquipmentVO vo, HttpServletRequest request) {
        List<MultipartFile> files = vo.getMfiles();
        List<EquipmentImgVO> eimglist = new ArrayList<>();

        // 이미지 파일 처리
        for (MultipartFile mf : files) {
            EquipmentImgVO eimgvo = new EquipmentImgVO();
            String oriFn = mf.getOriginalFilename();
            System.out.println("oriFn:" + oriFn);
            try {
                Path destinationFile = uploadDir.resolve(oriFn).normalize();
                Files.copy(mf.getInputStream(), destinationFile);
            } catch (Exception e) {
                e.printStackTrace();
            } finally {
                eimgvo.setImgname(oriFn);
                eimglist.add(eimgvo);
            }
        }
        // vo.setRname("비품명");
        equipmentService.add(vo, eimglist);
        return ResponseEntity.ok().body("Upload Success!");
    }

    // 비품 목록 조회
    @RequestMapping("/equipmentList")
    public List<EquipmentVO> listEquipment() {
        return equipmentService.list();
    }

    // 비품 상세 조회
    @GetMapping("/detail")
    public EquipmentVO detailEquipment(@RequestParam int num) {
        return equipmentService.detail(num);
    }

    @PutMapping
    public ResponseEntity<?> updateEquipment(EquipmentVO vo) {
        try {
            List<MultipartFile> files = vo.getMfiles();
            List<EquipmentImgVO> eimglist = new ArrayList<>();

            if (files != null && !files.isEmpty()) {
                for (MultipartFile mf : files) {
                    EquipmentImgVO eimgvo = new EquipmentImgVO();
                    String oriFn = mf.getOriginalFilename();

                    if (oriFn == null || oriFn.isEmpty()) {
                        continue; // 파일 이름이 없는 경우 스킵
                    }
                    System.out.println("oriFn:" + oriFn);
                    try {
                        Path destinationFile = uploadDir.resolve(oriFn).normalize();
                        if (Files.exists(destinationFile)) {
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
            equipmentService.update(vo, eimglist);
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
            equipmentService.deleteChild(num);
            // 부모 테이블 데이터 삭제
            equipmentService.delete(num);

            return ResponseEntity.ok().body("Delete Success!");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Delete Failed!");

        }
    }

    // 대여 내역 조회
    @GetMapping("/rentlist")
    public List<Map<String, Object>> getAllRentals() {
        return equipmentService.getAllRentals();
    }

    // 예약 목록 조회
    @GetMapping("/reservelist")
    public ResponseEntity<?> reservelist() {
        return ResponseEntity.ok(equipmentService.reservelist());
    }

}
