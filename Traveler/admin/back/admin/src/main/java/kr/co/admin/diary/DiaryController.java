package kr.co.admin.diary;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/api/diary")
public class DiaryController {

    @Autowired
    private DiaryService diaryService;


    //다이어리 리스트
    @GetMapping("/list")
    public Map<String, Object> getAllDiary(
        @RequestParam(name = "page", defaultValue = "1") int page, 
        @RequestParam(name = "size", defaultValue = "10") int size
    ) {
        return diaryService.getPagedDiaries(page, size);
    }



    // 다이어리 삭제
    @DeleteMapping("/{diaryNum}")
    public ResponseEntity<String> deleteDiary(@PathVariable(name = "diaryNum") Long diaryNum) {
        try {
            diaryService.deleteDiary(diaryNum);  // 서비스로 전달하여 다이어리 삭제
            return ResponseEntity.ok("다이어리가 삭제되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                .body("다이어리 삭제 중 오류가 발생했습니다.");
        }
    }



    // 다이어리 디테일
    @GetMapping("/detail/{num}")
    public ResponseEntity<Diary> getDiaryPages(@PathVariable("num") Long num) {
        Diary diary = diaryService.getDiaryPages(num);
        return ResponseEntity.ok(diary);
    }
    


   //페이징(전체 공유 다이어리)
   @GetMapping("/allshare")
   public Page<Diary> getAllSharedDiaries(
            @RequestParam(name = "page", defaultValue = "1") int page,
            @RequestParam(name = "size", defaultValue = "10") int size) {
        return diaryService.getAllshareDiarysWithPagination(page, size);
    }

    @GetMapping("/count")
    public long getDiaryCount() {
        return diaryService.getDiaryCount();
    }

    @GetMapping("/sharecount")
    public long getShareDiaryCount() {
        return diaryService.getShareDiaryCount();
    }

    @GetMapping("/mycount")
    public long getMyDiaryCount() {
        return diaryService.getMyDiaryCount();
    }
   




}
