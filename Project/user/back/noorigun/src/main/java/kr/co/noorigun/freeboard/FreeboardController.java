package kr.co.noorigun.freeboard;

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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

@RestController
@RequestMapping("/api/freeboard")
public class FreeboardController {

    @Autowired
    private FreeboardService freeboardService;
    // 업로드할 파일의 디렉토리 설정
    private final Path uploadDir = Paths.get("/noorigun/uploads")
            .toAbsolutePath().normalize();

    public FreeboardController() {
        try {
            Files.createDirectories(uploadDir);
        } catch (IOException e) {
            throw new RuntimeException("Failed to create upload directory.", e);
        }
    }

    @PostMapping // 게시글 작성, 이미지 업로드 - 서버에 이미지 파일 저장, 데이터베이스에 게시글 저장
    public Freeboard createFreeBoard(@ModelAttribute FreeBoardVO vo) throws IOException {
        List<String> imageNames = new ArrayList<>();
        System.out.println("Logs================>" + uploadDir);
        // 업로드된 이미지 처리
        if (vo.getImages() != null) {
            for (MultipartFile multipartFile : vo.getImages()) {
                if (!multipartFile.isEmpty()) {
                    String originalFileName = multipartFile.getOriginalFilename();
                    System.out.println(originalFileName);
                    try {
                        Path destinationFile = uploadDir.resolve(originalFileName).normalize();
                        Files.copy(multipartFile.getInputStream(), destinationFile); // 파일 저장
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
        // System.out.println(vo.getTitle());
        // System.out.println(vo.getWriter());
        // System.out.println(vo.getContent());
        // System.out.println("imageNames : " + imageNames);
        return freeboardService.createFreeboard(vo); // 서비스로 전달하여 저장 후 반환
    }

    // 특정 게시글 상세 조회
    @GetMapping("/{num}")
    public Freeboard getFreeboard(@PathVariable("num") Long num) {
        System.out.println("디테일 실행");
        return freeboardService.getBoardByNum(num); // 게시글 번호로 조회
    }

    // 제목을 포함하는 게시글을 페이징하여 조회
    @GetMapping("/search")
    public Page<Freeboard> getFreeboardByTitle(
            @RequestParam(name = "title", defaultValue = "") String title, // 제목
            @RequestParam(name = "page", defaultValue = "1") int page, // 페이지 번호
            @RequestParam(name = "size", defaultValue = "10") int size // 페이지 크기
    ) {
        return freeboardService.getFreeboardListWithPagination(title, page, size);
    }

    // 게시글 생성 테스트용
    @PostMapping("/test")
    public void creatFreeboard(FreeBoardVO vo) throws IOException {
        System.out.println("title:" + vo.getTitle());
    }

    // 게시글 페이징 처리된 목록 조회
    @GetMapping
    public Page<Freeboard> getFreeboards(
            @RequestParam(name = "title", defaultValue = "") String title, // 제목 감색어
            @RequestParam(name = "page", defaultValue = "1") int page, // 기본값 0, 페이지 번호
            @RequestParam(name = "size", defaultValue = "10") int size // 기본값 10, 페이지 크기
    ) {
        return freeboardService.getFreeboardListWithPagination(title, page, size); // 페이징된 게시글 반환
    }

    @DeleteMapping
    public ResponseEntity<?> deleteQnaBoard(@RequestParam("num") Long num) {
        freeboardService.delete(num); // 게시글 삭제
        return ResponseEntity.ok().body(num + "번 게시글 삭제 완료");
    }

}
