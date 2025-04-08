package kr.co.noorigun.promote;

import java.io.IOException;
import java.nio.file.FileAlreadyExistsException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/promote")
public class PromoteBoardController {
    @Autowired
    private PromoteBoardService promoteService;
    // 업로드할 파일의 디렉토리 설정
    private final Path uploadDir = Paths.get("noorigun/uploads")
            .toAbsolutePath().normalize();

    public PromoteBoardController() {
        try {
            Files.createDirectories(uploadDir);
        } catch (IOException e) {
            throw new RuntimeException("Failed to create upload directory", e);
        }
    }

    
    @PostMapping  // 게시글 작성, 이미지 업로드 - 서버에 이미지 파일 저장, 데이터베이스에 게시글 저장
    public PromoteBoard createGallery(PromoteBoardVO vo) throws IOException {
        List<String> imageNames = new ArrayList<>();
        System.out.println("Logs======>" + uploadDir);
        // 업로드된 이미지 처리
        if (vo.getImages() != null) {
            for (MultipartFile multipartFile : vo.getImages()) {
                if (!multipartFile.isEmpty()) {
                    String originalFileName = multipartFile.getOriginalFilename();
                    System.out.println(originalFileName);
                    Path destinationFile = uploadDir.resolve(originalFileName).normalize();
                    try {
                        Files.copy(multipartFile.getInputStream(), destinationFile); // 파일 저장
                    } catch (FileAlreadyExistsException e) {
                        System.out.println("파일이 이미 존재함");
                    } finally {
                        imageNames.add(originalFileName); // 파일명 추가
                    }
                }
            }
        } else {
            imageNames.add(""); // 이미지가 없는 경우 빈문자열 추가
        }
        vo.setImgNames(imageNames);
        return promoteService.createPromote(vo); // 서비스로 전달하여 저장 후 반환
    }

    // 페이징 처리된 홍보 게시글 목록 조회
    @GetMapping
    public Page<PromoteBoard> getAllPromotes(@RequestParam(name = "page", defaultValue = "1") int page,
            @RequestParam(name = "size", defaultValue = "9") int size,
            @RequestParam(name = "title", defaultValue = "") String title) {
        return promoteService.getAllPromotes(title, page, size);
    }

    // 전체 홍보글 목록 조회
    @GetMapping("list")
    public List<PromoteBoard> getAllBoard() {
        return promoteService.getAllBoard();
    }

    // 홍보 게시글 상세 조회
    @GetMapping("/detail")
    // @RequestParam("num") -> num이라는 인자값으로 parm을 넘기겠다 GetMapping 키값
    // getmapping에서 물음표 뒤에 오는 값
    public PromoteBoard getPromoteByNum(@RequestParam("num") Long num) {
        return promoteService.getPromoteByNum(num);
    }

    // 게시글 삭제
    @DeleteMapping
    public ResponseEntity<?> deleteBoard(@RequestParam("num") Long num) {
        promoteService.delete(num);
        return ResponseEntity.ok().body(num + "번째 데이터 삭제 완료");
    }

}
