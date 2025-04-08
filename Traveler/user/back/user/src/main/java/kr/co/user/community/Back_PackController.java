package kr.co.user.community;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;


import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
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


@RestController
@RequestMapping("/api/backpack") // API의 기본 URL 설정
public class Back_PackController { // BackPackService로 비즈니스 로직 실행

    @Autowired
    private Back_PackService back_PackService;

    private B_commService b_commService;

    private final Path uploadDir = Paths.get("./files/img/backpack") // 디렉토리 생성 -> 업로드된 파일 저장
            .toAbsolutePath().normalize();

    // 생성자(업로드된 디렉토리 생성)
    public Back_PackController() {
        try {
            Files.createDirectories(uploadDir); // 저장 폴더가 없으면 생성
        } catch (IOException e) {
            throw new RuntimeException("이미지 저장 디렉토리 생성 중 오류 발생: " + e.getMessage());
        }
    }

    // 전체 게시글 조회 (최신순)
    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllBackPackList() {
        List<Back_Pack> posts = back_PackService.getAllBackPackList();

        // 필요한 정보만 추출하여 리스트로 반환
        List<Map<String, Object>> response = new ArrayList<>();

        for (Back_Pack post : posts) {
            Map<String, Object> postData = new HashMap<>();
            postData.put("num", post.getNum());
            postData.put("title", post.getTitle());
            postData.put("memberNum", post.getMember().getNum());
            postData.put("memberName", post.getMember().getName());
            postData.put("content", post.getContent());
            postData.put("imgNames", post.getImgNames());
            postData.put("tag", post.getTag());
            postData.put("cdate", post.getCdate());
            postData.put("hit", post.getHit());
            postData.put("heart", post.getHeart());
            // postData.put("bcommlist", post.getBcommlist());
            postData.put("bcommlist", new ArrayList<>());

            response.add(postData);
        }

        return ResponseEntity.ok(response);
    }

    // 특정 게시글 조회
    @GetMapping("/{num}")
    public ResponseEntity<Back_Pack> getPostById(@PathVariable("num") Long num) {
        Optional<Back_Pack> post = back_PackService.getPostById(num);

        return post.map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body(null));
    }

    // 페이징 처리
    @GetMapping("/search")
    public Page<Map<String, Object>> getBackPackListByTitle(
            @RequestParam(name = "title", required = false, defaultValue = "") String title, // 제목
            @RequestParam(name = "page", defaultValue = "1") int page, // 페이지 번호
            @RequestParam(name = "size", defaultValue = "10") int size // 페이지 크기
    ) {
        return back_PackService.getBackPackListWithPagination(title, page, size);
    }

    // 게시글 작성 (이미지 업로드 포함)
    @PostMapping("/create")
    public ResponseEntity<?> createPost(
            @RequestParam(value = "memberNum", required = true) Long memberNum,
            @RequestParam(value = "title", required = true) String title,
            @RequestParam(value = "content", required = true) String content,
            @RequestParam(value = "tag", required = false) List<String> tag,
            @RequestParam(value = "images", required = false) List<MultipartFile> images) {

        // 이미지 저장 (파일 처리)
        List<String> savedImageNames = new ArrayList<>();
        Path uploadDir = Paths.get("./files/img/backpack"); // 이미지 저장 경로 지정
        if (images != null && !images.isEmpty()) {
            for (MultipartFile image : images) {
                try {
                    if (image.isEmpty())
                        continue; // 빈 파일 방지
                    String fileName = UUID.randomUUID().toString() + "_" + image.getOriginalFilename();
                    Path targetPath = uploadDir.resolve(fileName);
                    Files.copy(image.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);
                    savedImageNames.add(fileName);
                } catch (IOException e) {
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .body("{\"error\": \"파일 저장 중 오류 발생: " + e.getMessage() + "\"}");
                }
            }
        }

        // 게시글 저장
        Back_Pack createdPost = back_PackService.createPost(memberNum, title, content, savedImageNames, tag);

        // 필요한 정보만 추출하여 Map 형태로 응답
        Map<String, Object> response = new HashMap<>();
        response.put("num", createdPost.getNum());
        response.put("title", createdPost.getTitle());
        response.put("memberNum", createdPost.getMember().getNum());
        response.put("memberName", createdPost.getMember().getName());
        response.put("content", createdPost.getContent());
        response.put("imgNames", createdPost.getImgNames());
        response.put("tag", createdPost.getTag());

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // 이미지 조회 API
    @GetMapping("/images/{fileName}")
    public ResponseEntity<?> getImage(@PathVariable("fileName") String fileName) {
        try {
            Path filePath = uploadDir.resolve(fileName);
            return ResponseEntity.ok()
                    .header("Content-Type", Files.probeContentType(filePath))
                    .body(Files.readAllBytes(filePath));
        } catch (IOException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // 특정 게시글 상세 조회
    @GetMapping("/detail/{num}")
    public ResponseEntity<Map<String, Object>> getBackPackByNum(@PathVariable("num") Long num) {
        Back_Pack post = back_PackService.getBackPackByNum(num);

        if (post == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        // 필요한 데이터만 담아 반환
        Map<String, Object> response = new HashMap<>();
        response.put("member", Map.of(
                "num", post.getMember().getNum(),
                "name", post.getMember().getName())); // memberNum과 memberName만 포함
        response.put("num", post.getNum());
        response.put("title", post.getTitle());
        response.put("content", post.getContent());
        response.put("images", post.getImgNames() != null ? post.getImgNames() : new ArrayList<>()); // Null 방지
        response.put("hit", post.getHit());
        response.put("cdate", post.getCdate());
        response.put("heart", post.getHeart());
        response.put("tag", post.getTag());

        return ResponseEntity.ok(response);
    }

    // 게시글 삭제
    @DeleteMapping("/delete/{num}")
    public ResponseEntity<?> deleteBackPack(@PathVariable("num") Long num) {
        back_PackService.delete(num);
        return ResponseEntity.ok().body("삭제완료");
    }

    // 게시글 수정
    @PutMapping("/update")
    public ResponseEntity<?> updateBackPack(@RequestBody Back_Pack vo) {
        Back_Pack updatedPost = back_PackService.updateBackPack(vo);
        return ResponseEntity.ok(updatedPost);
    }
    


}