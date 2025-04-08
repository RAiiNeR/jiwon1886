package kr.co.user.diary;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import kr.co.user.hotel.entity.Hotel;

import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/api/diary")
public class DiaryController {

    @Autowired
    private DiaryService diaryService;

    
    //다이어리 업로드
    @PostMapping("/create")
    public String createDiary(@RequestParam Map<String, Object> map,
                              @RequestParam("thumbnail") String thumbnail,
                              @RequestParam(value = "imgnameFiles", required = false) List<MultipartFile> imgnameFiles) {
        System.out.println("map 데이터: " + map);
        System.out.println(map.get("happy"));
        diaryService.createDiary(map, thumbnail, imgnameFiles);
        return "다이어리 저장 완료!";
    }

    //다이어리 리스트
    @GetMapping("/list")
    public List<DiaryVO> getAllDiary() {
        return diaryService.getAllDiary();
    }


    // 선택된 다이어리 삭제
    @DeleteMapping
    public String deleteSelectedDiaries(@RequestBody List<Long> diaryNums) {
        for (Long diaryNum : diaryNums) {
            diaryService.deleteDiary(diaryNum);
        }
        return "선택된 다이어리가 삭제되었습니다.";
    }




    
    //특정 다이어리
    @GetMapping("/list/{num}")
    public List<DiaryVO> getOneDiary() {
        return diaryService.getAllDiary();
    }
    
    // 다이어리 디테일
    @GetMapping("/detail/{num}")
    public ResponseEntity<Diary> getDiaryPages(@PathVariable("num") Long num) {
        Diary diary = diaryService.getDiaryPages(num);
        return ResponseEntity.ok(diary);
    }
    

    // 공유 다이어리 9개 가져오기
    @GetMapping("/share")
    public ResponseEntity<List<Diary>> getShareDiaries() {
        List<Diary> shareDiaries = diaryService.getShareDiaryList();
        return ResponseEntity.ok(shareDiaries);
    }

     // 선택된 다이어리들을 공유 상태로 변경
     @PutMapping("/share")
     public ResponseEntity<String> shareDiaries(@RequestBody List<Integer> selectedDiaries) {
        try {
            // 서비스에서 다이어리 상태 업데이트
            diaryService.updateShareStatus(selectedDiaries);
            return ResponseEntity.ok("다이어리가 성공적으로 공유되었습니다.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("다이어리 공유 실패");
        }
    }

    // 선택된 다이어리들을 공유 취소
    @PutMapping("/noshare")
    public ResponseEntity<String> noshareDiaries(@RequestBody List<Integer> selectedDiaries) {
       try {
           // 서비스에서 다이어리 상태 업데이트
           diaryService.updateNotShareStatus(selectedDiaries);
           return ResponseEntity.ok("다이어리가 성공적으로 공유되었습니다.");
       } catch (Exception e) {
           e.printStackTrace();
           return ResponseEntity.status(500).body("다이어리 공유 실패");
       }
   }


   
//    public String getMethodName(@RequestParam String param) {
//        return new String();
//    }
   //페이징(전체 공유 다이어리)
   @GetMapping("/allshare")
   public Page<Diary> getAllSharedDiaries(
            @RequestParam(name = "page", defaultValue = "1") int page,
            @RequestParam(name = "size", defaultValue = "9") int size) {
        return diaryService.getAllshareDiarysWithPagination(page, size);
    }
   



   //페이징(공유 다이어리)
    @GetMapping("/sharediary")
    public Page<Diary> getSharedDiaries(
            @RequestParam(name = "membernum") int membernum,
            @RequestParam(name = "page", defaultValue = "1") int page,
            @RequestParam(name = "size", defaultValue = "8") int size) {
        return diaryService.getMyshareDiarysWithPagination(membernum, page, size);
    }
   

    //페이징(나의 다이어리)
    @GetMapping("/mydiarylist")
    public Page<Diary> getMydDiaries(
            @RequestParam(name ="membernum") int membernum,
            @RequestParam(name = "page", defaultValue = "1") int page,
            @RequestParam(name = "size", defaultValue = "8") int size) {
        return diaryService.getMyDiarysWithPagination(membernum, page, size);
    }




}
