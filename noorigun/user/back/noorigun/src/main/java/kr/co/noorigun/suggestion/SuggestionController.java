package kr.co.noorigun.suggestion;

//import java.io.File;
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
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/suggestion")
public class SuggestionController {

    @Autowired
    private SuggestionService suggestionService;
    // 파일을 저장할 디렉토리를 준비하는 코드  
    private final Path uploadDir = Paths.get("noorigun/uploads")
            .toAbsolutePath().normalize();

    public SuggestionController() {
        try {
            Files.createDirectories(uploadDir);
        } catch (IOException e) {
            throw new RuntimeException("Failed to create upload directory.", e);
        }
    }

    // 게시글 생성, 이미지 업로드 => 서버에 이미지저장, DB에 게시글 저장
    @PostMapping
    public Suggestion createSuggestion(SuggestionVO vo) throws IOException {
        List<String> imageNames = new ArrayList<>();
        System.out.println("Log===============>" + uploadDir);
        // 업로드된 이미지 처리
        if (vo.getImages() != null) {
            for (MultipartFile multipartFile : vo.getImages()) {
                if (!multipartFile.isEmpty()) {
                    String originalFileName = multipartFile.getOriginalFilename();
                    System.out.println(originalFileName);
                    try {
                        Path destinationFile = uploadDir.resolve(originalFileName).normalize();
                        Files.copy(multipartFile.getInputStream(), destinationFile);
                    } catch (FileAlreadyExistsException e) {
                        System.out.println("파일이 이미 있음");
                    } finally {
                        imageNames.add(originalFileName); // 파일명 추가
                    }
                }
            }
        } else {
            imageNames.add(""); // 이미지가 없는 경우 빈문자열 추가
        }
        vo.setImgNames(imageNames); // 업로드된 파일명 설정
        vo.setState("등록");
        // System.out.println(vo.getTitle());
        // System.out.println(vo.getWriter());
        // System.out.println(vo.getContent());
        // System.out.println("imageNames : " + imageNames);

        // 게시글 생성 서비스 호출
        return suggestionService.createSuggestion(vo); // 서비스로 전달하여 저장 후 반환
    }

     // 특정 게시글 상세 조회
    @GetMapping("/{num}")
    public Suggestion getSuggestion(@PathVariable Long num) {
        System.out.println("디테일 실행");
        return suggestionService.getSuggestByNum(num); // 게시글 번호로 조회
    }

    // 게시글 페이징 처리된 목록 조회
    @GetMapping
    public Page<Suggestion> getSuggestions(
            @RequestParam(name = "title", defaultValue = "") String title,
            @RequestParam(name = "page", defaultValue = "1") int page, // 기본값 0, 페이지 번호
            @RequestParam(name = "size", defaultValue = "10") int size // 기본값 10, 페이지 크기
    ) {
        return suggestionService.getSuggestionListWithPagination(title, page, size); // 페이징된 게시글 반환
    }

    // 삭제
    @DeleteMapping
    public ResponseEntity<?> deleteSuggestion(@RequestParam("num") Long num) {
        suggestionService.delete(num);
        return ResponseEntity.ok().body(num + "번째 데이터 삭제 완료");
    }

}
