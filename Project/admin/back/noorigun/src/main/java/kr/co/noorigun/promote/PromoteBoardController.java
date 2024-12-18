package kr.co.noorigun.promote;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
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
import kr.co.noorigun.vo.PB_IMGVO;
import kr.co.noorigun.vo.PromoteBoardVO;

@RestController
@RequestMapping("/api/promote")
public class PromoteBoardController {
    @Autowired
    private PromoteBoardService promoteBoardService;

    // 파일 업로드 디렉토리 지정
    private final Path uploadDir = Paths.get("/noorigun/uploads").toAbsolutePath().normalize();

    // 게시판 글 추가 + 이미지 파일 업로드
    @PostMapping
    public ResponseEntity<?> addPromote(PromoteBoardVO vo) {
        List<MultipartFile> files = vo.getMfiles();
        List<PB_IMGVO> pblist = new ArrayList<>();

        for (MultipartFile mf : files) {
            PB_IMGVO pbvo = new PB_IMGVO();
            String oriFn = mf.getOriginalFilename();// 원본 파일 이름
            System.out.println("oriFn:" + oriFn);
            try {
                // 전체 경로를 기준으로 파일 객체를 생성
                Path destinationFile = uploadDir.resolve(oriFn).normalize();
                Files.copy(mf.getInputStream(), destinationFile);// 파일 복사
            } catch (Exception e) {
                e.printStackTrace();// 예외처리 발생 시
            } finally {
                pbvo.setImgname(oriFn);// 객체에 이미지 파일 이름 설정
                pblist.add(pbvo);// 리스트에 이미지 추가
            }
        }
        // 글 작성자는 "관리자"로 지정
        vo.setWriter("관리자");
        // 게시글과 이미지 저장
        promoteBoardService.add(vo, pblist);
        return ResponseEntity.ok().body("Upload Successful");
    }

    // 전체 게시글 리스트
    @RequestMapping("/promoteList")
    public Page<PromoteBoardVO> promoteList(
        @RequestParam(defaultValue = "1") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(defaultValue = "") String searchValue
    ) {
        return promoteBoardService.list(page,size,searchValue);
    }

    // 선택한 게시글 디테일
    @GetMapping("/detail")
    public PromoteBoardVO detailPromote(@RequestParam int num) {
        return promoteBoardService.detail(num);
    }

    // 게시글 내용 수정하기
    @PutMapping
    public ResponseEntity<?> updatePromote(PromoteBoardVO vo) {
        try {
            List<MultipartFile> files = vo.getMfiles();//파일 가져오기
            List<PB_IMGVO> pblist = new ArrayList<>();//이미지 정보 리스트(DB)에 추가하기

            if (files != null && !files.isEmpty()) {
                for (MultipartFile mf : files) {
                    PB_IMGVO pbvo = new PB_IMGVO();
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
                                .body("File saving failed for file: " + oriFn);
                    } finally {
                        pbvo.setImgname(oriFn);
                        pbvo.setPbnum(vo.getNum()); // 이미지와 게시글 번호를 연결
                        pblist.add(pbvo);
                    }
                }
            }
            // System.out.println(pblist.get(0).getImgname() + "/" + pblist.get(1).getImgname());
            // 서비스 호출로 업데이트 처리
            promoteBoardService.update(vo, pblist);
            return ResponseEntity.ok().body("Update Successful");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Update Failed!");
        }
    }

    // 게시글 삭제
    @DeleteMapping
    public ResponseEntity<?> deletePromote(@RequestParam int num) {
        try {
            // 자식 테이블 데이터 삭제
            promoteBoardService.deleteChild(num);
            // 부모 테이블 데이터 삭제
            promoteBoardService.delete(num);

            return ResponseEntity.ok().body("Delete Success!");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Delete Failed!");
        }

    }

}
