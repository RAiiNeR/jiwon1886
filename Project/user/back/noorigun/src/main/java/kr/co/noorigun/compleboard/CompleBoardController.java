package kr.co.noorigun.compleboard;

import java.io.IOException;
import java.nio.file.FileAlreadyExistsException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
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

@RestController
@RequestMapping("/api/compleboard")
public class CompleBoardController {
    @Autowired
    private CompleBoardService compleBoardService;
    // 업로드할 파일의 디렉토리 설정
    private final Path uploadDir = Paths.get("/noorigun/uploads")
            .toAbsolutePath().normalize();

    public CompleBoardController() {
        try {
            Files.createDirectories(uploadDir);
        } catch (Exception e) {
            throw new RuntimeException("Failed to create upload directory", e);
        }
    }

    @PostMapping // 게시글 작성, 이미지 업로드 - 서버에 이미지 파일 저장, 데이터베이스에 게시글 저장
    public CompleBoard createBoard(CompleBoardVO vo) throws IOException {
        List<String> imageNames = new ArrayList<>();
        System.out.println("Logs===============>" + uploadDir);
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
                        System.out.println(1);
                        imageNames.add(originalFileName); // 파일명 추가
                    }
                }
            }
        } else {
            imageNames.add(""); // 이미지가 없는 경우 빈문자열 추가
        }
        vo.setImgNames(imageNames); // 업로드된 파일명 설정
        return compleBoardService.creatCompleBoard(vo); // 서비스로 전달하여 저장 후 반환
    }

    // 게시글 목록 조회 (페이징 및 검색 기능 포함)
    @GetMapping
    public Page<CompleBoard> getAllBoards(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "9") int size,
            @RequestParam(defaultValue = "") String title,
            @RequestParam(defaultValue = "") String writer) {
        return compleBoardService.getAllBoards(title, writer, page, size);
    }

    // 툭정 게시글 상세 조회
    @GetMapping("/detail")
    public CompleBoard getBoardByNum(@RequestParam("num") Long num) {
        return compleBoardService.getBoardByNum(num); // 게시글 데이터
    }

    // 게시글 석제
    @DeleteMapping
    public ResponseEntity<?> deleteBoard(@RequestParam("num") Long num) {
        compleBoardService.delete(num);
        return ResponseEntity.ok().body(num + "번째 데이터 삭제 완료");
    }

    // 게시글 비밀번호 검증
    @GetMapping("/verifyPassword")
    public ResponseEntity<Boolean> verifyPassword(@RequestParam("num") Long num, @RequestParam("pwd") String pwd) {
        CompleBoard post = compleBoardService.getBoardWithoutHit(num);
        if (post != null) {
            try {
                Long inputPwd = Long.valueOf(pwd); // 입력받은 비밀번호를 Long으로 변환
                if (post.getPwd().equals(inputPwd)) {
                    return ResponseEntity.ok(true); // 비밀번호가 일치하면 true 반환
                }
            } catch (NumberFormatException e) {
                // 비밀번호가 숫자로 변환되지 않는 경우
                return ResponseEntity.ok(false);
            }
        }
        return ResponseEntity.ok(false); // 게시글이 없거나 비밀번호가 틀린 경우
    }

    // 게시글 수정
    @PutMapping("/edit")
    public ResponseEntity<CompleBoard> updateCompleBoard(
            @RequestParam("num") Long num,
            @RequestBody CompleBoardVO updatedBoard) {
        // 서비스 레이어 호출
        CompleBoard savedBoard = compleBoardService.updateCompleBoard(num, updatedBoard);
        return ResponseEntity.ok(savedBoard); // 수정된 게시글
    }

    // 상태별 게시글 통계 데이터 조회
    @GetMapping("/chart")
    public List<Map<String, String>> getCompleChartData() {
        return compleBoardService.findByContainingByState();
    }

    // 부서 상태별 게시글 통계 데이터 조회
    @GetMapping("/chart/{deptno}")
    public Map<String, String> getCompleChartData(@PathVariable("deptno") Long deptno) {
        System.out.println(compleBoardService.findByDeptnoContainingByState(deptno).get("DNAME"));
        return compleBoardService.findByDeptnoContainingByState(deptno);
    }
}