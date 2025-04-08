package kr.co.noorigun.manager;

import java.io.IOException;
import java.nio.file.FileAlreadyExistsException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/api/manager")
public class ManagerController {
    @Autowired
    private ManagerService managerService;

    @Autowired
	private PasswordEncoder passwordEncoder; // 비밀번호 암호화를 위한 PasswordEncoder 객체

    // 파일 업로드 경로
    private final Path uploadDir = Paths.get("noorigun/uploads/manager").toAbsolutePath().normalize();

    // 저장할 경로 생성
    public ManagerController() {
        try {
            Files.createDirectories(uploadDir);
        } catch (IOException e) {
            throw new RuntimeException("Failed to create upload directory.", e);
        }

    }

    @PostMapping
    public ResponseEntity<?> addManager(ManagerDto dto) throws IOException {
        MultipartFile mf = dto.getMfile();
        if (!mf.isEmpty()) {
            String originalFileName = mf.getOriginalFilename();// 원본 파일명 가져오기
            System.out.println(originalFileName);
            try {
                Path destinationFile = uploadDir.resolve(originalFileName).normalize();
                Files.copy(mf.getInputStream(), destinationFile);
            } catch (FileAlreadyExistsException e) {
                System.out.println(e);
            } finally {
                dto.setImgname(originalFileName);// 객체에 파일이름 저장
            }
        }
        String encodePwd = passwordEncoder.encode(dto.getPwd());
        dto.setPwd(encodePwd);
        managerService.addManager(dto);
        return ResponseEntity.ok("생성 완료");
    }

    @GetMapping
    public Page<Map<String, String>> getManager(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "") String searchValue) {
        return managerService.getManager(page, size, searchValue);
    }

    @GetMapping("/{id}")
    public int getManager(@PathVariable String id) {
        Optional<ManagerDto> manager = managerService.getManagerById(id);
        if (manager.isEmpty()) {
            return 0;
        }
        return 1;
    }

}
