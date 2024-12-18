package kr.co.noorigun.program;

import java.io.IOException;
import java.nio.file.FileAlreadyExistsException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import kr.co.noorigun.member.MemberVO;

@RestController
@RequestMapping("/api/program")
public class ProgramController {

    @Autowired
    private ProgramService programService;

    // 나이계산
    // 2000년이후 출생 -> (현재년도-출생년도)+1
    // 2000년이전 출생 -> (100-출생년도)+현재년도+1
    public Integer calage(MemberVO vo) {
        // 현재 날짜 구하기 (시스템 시계, 시스템 타임존)
        LocalDate now = LocalDate.now();
        int nowYear = now.getYear();
        int birth = Integer.parseInt((vo.getSsn()).substring(0, 2));
        int agecategory = 0;

        if (birth >= 0 && birth <= nowYear) {
            int age = (nowYear - birth) + 1;
            if (age >= 3 && age <= 7) {// 유아부
                agecategory = 1;
            } else if (age >= 8 && age <= 19) {// 학생부
                agecategory = 2;
            }
        } else {
            int age = (100 - birth) + nowYear + 1;
            if (age >= 60) {// 노년부
                agecategory = 3;
            }
        }
        return agecategory;
    }

    // 파일을 저장할 디렉토리 코드
    private final Path uploadDir = Paths.get("/noorigun/uploads")
            .toAbsolutePath().normalize();

    public ProgramController() {
        try {
            Files.createDirectories(uploadDir);
        } catch (IOException e) {
            throw new RuntimeException("Failed to create upload directory.", e);
        }
    }

    // 단일 이미지 업로드를 위한
    @PostMapping
    public Program createProgram(ProgramVO vo) throws IOException {
        MultipartFile mfile = vo.getMfile();
        if (!mfile.isEmpty()) { // mfile이 비워있지 않으면
            String originalFileName = mfile.getOriginalFilename(); // 파일이 만들어 진다
            System.out.println(originalFileName);
            try {
                Path destinationFile = uploadDir.resolve(originalFileName).normalize();
                Files.copy(mfile.getInputStream(), destinationFile);
            } catch (FileAlreadyExistsException e) {
                System.out.println("파일이 이미 있음");
            } finally {
                vo.setImg(originalFileName); // 파일이름을 가져올 객체
            }

        }

        // 게시글 생성 서비스 호출
        return programService.createProgram(vo); // 서비스로 전달하여 저장 후 반환
    }

    // 디테일
    @GetMapping("/{num}")
    public Program getProgramByNum(@PathVariable Long num) {
        return programService.getProgramByNum(num);
    }

    // 게시글 페이징 처리된 목록
    @GetMapping
    public Page<Program> getallProgram(
            @RequestParam(name = "title", defaultValue = "") String title,
            @RequestParam(name = "page", defaultValue = "1") int page, // 기본값 0, 페이지 번호
            @RequestParam(name = "size", defaultValue = "10") int size) {
        return programService.getProgramListWithPagination(title, page, size);
    }
    //회원이 프로그램 신청시 정원에서 -1 해주는 역할
    @PatchMapping("/enroll/{num}")
    public ResponseEntity<String> enrollProgram(@PathVariable Long num) {
        try {
            String result = programService.enrollProgram(num);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("수강생 수 감소 실패");
        }
    }

    // 최신 3개의 프로그램 가져오기
    @GetMapping("/latest")
    public List<Program> getLatestPrograms() {
        return programService.getLatestPrograms();  // 최신 3개 프로그램 가져오기
    }
}
