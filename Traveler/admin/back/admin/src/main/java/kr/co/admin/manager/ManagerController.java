package kr.co.admin.manager;

import java.io.IOException;
import java.nio.file.FileAlreadyExistsException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import jakarta.servlet.http.HttpServletRequest;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;


@RestController
@RequestMapping("/api/manager")
public class ManagerController {
    @Autowired
    private PasswordEncoder passwordEncoder;


    private Path uploadPath = Paths.get("./files/img/manager").toAbsolutePath().normalize();

    public ManagerController() {
        try {
            Files.createDirectories(uploadPath);
        } catch (Exception e) {
            throw new RuntimeException("Failed to create upload directory", e);
        }
    }

    @Autowired
    private ManagerService managerService;

    @GetMapping("/count")
    public Long countAllManagers() {
        return managerService.countAllManagers();
    }

    @GetMapping("/{sabun}")
    public Manager getManager(@PathVariable("sabun") String sabun) {
        return managerService.getManager(sabun);
    }

    @PostMapping
    public ResponseEntity<?> addManager(@ModelAttribute ManagerVO vo) throws IOException {
        MultipartFile mf = vo.getImg();
        String filename;
        if (mf != null && !mf.isEmpty()) {
            String originalFileName = mf.getOriginalFilename();
            System.out.println(originalFileName);
            try {
                Path destinationFile = uploadPath.resolve(originalFileName).normalize();
                Files.copy(mf.getInputStream(), destinationFile); // 파일 저장
            } catch (FileAlreadyExistsException e) {
                System.out.println("파일이 이미 있음");
            } finally {
                System.out.println(1);
                filename = originalFileName; // 파일명 추가
                Manager entity = new Manager();
                entity.setSabun(vo.getSabun());
                String encodepass = passwordEncoder.encode(vo.getPwd());
                entity.setPwd(encodepass);
                entity.setName(vo.getName());
                entity.setRole(vo.getRole());
                entity.setImgname(filename);
                entity.setMdate(new Date());
                entity.setEmail(vo.getEmail());
                managerService.addManager(entity);
            }
            return ResponseEntity.ok("Added successfully");
        }
        return ResponseEntity.status(500).body("File Is Empty");

    }

    @PostMapping("logging/{sabun}")
    public ResponseEntity<?> addLog(@PathVariable("sabun") String sabun, @RequestParam("abnormal") Long abnormal, HttpServletRequest request) {
        String remoteIp = request.getRemoteAddr();
        return ResponseEntity.ok(managerService.logging(sabun, remoteIp, abnormal));
    }

    @GetMapping("logging/{sabun}")
    public ResponseEntity<?> getAbnormalLogCount(@PathVariable("sabun") String sabun) {
        return ResponseEntity.ok(managerService.getAbnormalLog(sabun));
    }

    @GetMapping("log/count/{sabun}")
    public ResponseEntity<?> getLogsCount(@PathVariable("sabun") String sabun) {
        int abnormal = managerService.getAbnormalLog(sabun);
        int normal = managerService.getNormalLog(sabun);
        int hotkey = managerService.getHotkeyLog(sabun);
        Map<String, Integer> map = new HashMap<String, Integer>();
        map.put("normal", normal);
        map.put("abnormal", abnormal);
        map.put("hotkey", hotkey);
        return ResponseEntity.ok(map);
    }


    // 특정 관리자 삭제
    @DeleteMapping("/delete/{sabun}")
    public ResponseEntity<String> deleteManager(@PathVariable String sabun) {
        managerService.deleteManager(sabun);
        return ResponseEntity.ok("관리자 삭제 완료");
    }

    // 전체 관리자 삭제
    @DeleteMapping("/delete/all")
    public ResponseEntity<String> deleteAllManagers() {
        managerService.deleteAllManagers();
        return ResponseEntity.ok("전체 관리자 삭제 완료");
    }


}
