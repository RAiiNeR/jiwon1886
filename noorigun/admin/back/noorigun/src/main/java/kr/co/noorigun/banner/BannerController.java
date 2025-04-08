package kr.co.noorigun.banner;

import java.io.IOException;
import java.nio.file.FileAlreadyExistsException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import kr.co.noorigun.vo.BannerVO;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

@RestController
@RequestMapping("/api/banner")
public class BannerController {
    @Autowired
    private BannerService bannerService;

    // 파일 업로드 경로
    private final Path uploadDir = Paths.get("noorigun/uploads/banner").toAbsolutePath().normalize();

    // 저장할 경로 생성
    public BannerController() {
        try {
            Files.createDirectories(uploadDir);
        } catch (IOException e) {
            throw new RuntimeException("Failed to create upload directory.", e);
        }

    }

    // 배너 추가
    @PostMapping
    public ResponseEntity<?> addBanner(BannerVO vo) throws IOException {
        MultipartFile mf = vo.getImage();

        if (!mf.isEmpty()) {
            String originalFileName = mf.getOriginalFilename();// 원본 파일명 가져오기
            System.out.println(originalFileName);
            try {
                Path destinationFile = uploadDir.resolve(originalFileName).normalize();
                Files.copy(mf.getInputStream(), destinationFile);
            } catch (FileAlreadyExistsException e) {
                System.out.println(e);
            } finally {
                vo.setImgname(originalFileName);// 객체에 파일이름 저장
            }
        }

        bannerService.addBanner(vo);
        return ResponseEntity.ok().body("생성완료");
    }

    // 배너 전체 목록 가져오기
    @GetMapping
    public List<BannerVO> getList() {
        return bannerService.getList();
    }

    // 배너 삭제
    @DeleteMapping
    public ResponseEntity<?> delete(@RequestParam("num") List<Long> num) {
        bannerService.delete(num);
        return ResponseEntity.ok().body("삭제 완료");
    }

}
