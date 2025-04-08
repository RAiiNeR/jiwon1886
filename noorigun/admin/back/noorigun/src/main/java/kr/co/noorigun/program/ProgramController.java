package kr.co.noorigun.program;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
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

import kr.co.noorigun.vo.MemberVO;
import kr.co.noorigun.vo.ProgramVO;

@RestController
@RequestMapping("/api/program")
public class ProgramController {
    @Autowired
    private ProgramService programService;

    private final Path uploadDir = Paths.get("noorigun/uploads").toAbsolutePath().normalize();
    
    //나이계산
    //2000년이후 출생 -> (현재년도-출생년도)+1
    //2000년이전 출생 -> (100-출생년도)+현재년도+1
    public Integer calage(MemberVO vo){
        // 현재 날짜 구하기 (시스템 시계, 시스템 타임존)        
        LocalDate now = LocalDate.now();
        int nowYear = now.getYear();
        int birth =Integer.parseInt((vo.getSsn()).substring(0,2));
        int agecategory=0;

        if( birth>=0 && birth <= nowYear){
            int age = (nowYear-birth)+1;
            if(age>=3 && age<=7){//유아부
                agecategory= 1;
            }else if(age>=8 && age<=19){//학생부
                agecategory= 2;
            }
        }else{
            int age = (100-birth)+nowYear+1;
            if(age>=60){//노년부
                agecategory = 3;
            }
        }
        return agecategory;
    }
    
    //프로그램 업로드
    @PostMapping
    public ResponseEntity<?> addProgram(ProgramVO vo){
        MultipartFile mf = vo.getMfile();

        if (!mf.isEmpty()) {
            String originalFileName = mf.getOriginalFilename();
            // 파일 이름에 중복 방지를 위한 UUID 추가
            String uniqueFileName = UUID.randomUUID().toString() + "_" + originalFileName;
            
            try {
                // 업로드 디렉토리가 없으면 생성
                if (!Files.exists(uploadDir)) {
                    Files.createDirectories(uploadDir);
                }

                // 파일을 지정된 경로에 저장
                Path destinationFile = uploadDir.resolve(uniqueFileName).normalize();
                Files.copy(mf.getInputStream(), destinationFile);
                
            } catch (IOException e) {
                e.printStackTrace();
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("File upload failed");
            } finally {
                // 파일명 업데이트 (ProgramVO에 설정)
                vo.setImg(uniqueFileName);
            }
        }       

        // 프로그램 정보를 서비스 레이어로 전달
        programService.add(vo);

        // 업로드 성공 메시지 반환
        return ResponseEntity.ok().body("upload success");
    }

    // 프로그램 상세 조회
    @GetMapping("/detail")
    public ResponseEntity<ProgramVO> getProgramDetail(@RequestParam int num) {
        ProgramVO program = programService.detail(num);
        return ResponseEntity.ok(program);
    }

    // 프로그램 리스트
    @GetMapping("/programList")
    public List<ProgramVO> promoteList() {
        return programService.list();
    }

    //프로그램 삭제
    @DeleteMapping
    public ResponseEntity<?> delete(@RequestParam("num") int num) {
        programService.delete(num);
        return ResponseEntity.ok().body("삭제 완료");
    }
    
    //프로그램 수정
    @PutMapping
    public ResponseEntity<?> updatePromote(ProgramVO vo) {
        System.out.println("+++"+vo.getTitle());
        try {
            MultipartFile file = vo.getMfile();  // 단일 파일 처리

            // 파일이 존재하는지 확인 후 처리
            if (file != null && !file.isEmpty()) {
                String oriFn = file.getOriginalFilename();  // 파일 이름 가져오기
                if (oriFn == null || oriFn.isEmpty()) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                            .body("No file uploaded");
                }
                System.out.println("oriFn:" + oriFn);

                try {
                    // 파일 업로드 경로 설정
                    Path destinationFile = uploadDir.resolve(oriFn).normalize();
                    // 기존 파일이 존재하면 삭제
                    if (Files.exists(destinationFile)) {
                        Files.delete(destinationFile);  // 기존 파일 삭제
                    }
                    // 새 파일을 저장
                    Files.copy(file.getInputStream(), destinationFile);
                    vo.setImg(oriFn);
                } catch (IOException e) {
                    e.printStackTrace();
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .body("File saving failed for file: " + oriFn);
                }
            }
            programService.update(vo);
            return ResponseEntity.ok().body("Update Successful");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Update Failed!");
        }
    }

    //수강생 리스트 조회
    @GetMapping("memberlist")
    public ResponseEntity<List<MemberVO>> memberList(@RequestParam("num") int num){
        List<MemberVO> member = programService.memberlist(num); // 수강생 리스트 조회
        return ResponseEntity.ok(member); // member 변수 반환
    }

}
