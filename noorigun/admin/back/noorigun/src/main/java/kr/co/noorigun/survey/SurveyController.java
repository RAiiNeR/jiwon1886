package kr.co.noorigun.survey;

import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import kr.co.noorigun.vo.SurveyVO;

@RestController
@RequestMapping("/api/survey") // 모든 엔드포인트는 해당 경로로 시작
public class SurveyController {

    @Autowired
    private SurveyService surveyService;// 객체 주입받아서 서비스로직을 처리

    // 새로운 설문조사 추가하는 post
    @PostMapping("/addsurvey")
    public ResponseEntity<?> addsurvey(@RequestBody SurveyVO vo) {
        try {
            surveyService.saveSurvey(vo);
            return ResponseEntity.ok(vo);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }

    }

    // 모든 설문조사의 목록을 조회하는 get요청처리
    @GetMapping
    public Page<Map<String,String>> getSurveyList(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        return surveyService.getSurveyList(page, size);
    }

    // 특정 설문조사의 정보를 조회하는 get요청처리
    @GetMapping("/{num}")
    public ResponseEntity<SurveyVO> getSurveyByNum(@PathVariable int num) {
        SurveyVO vo = surveyService.getSurvey(num);
        return ResponseEntity.ok(vo);
    }

    // 특정 설문과 설문에 포함된 옵션까지 삭제하는 기능
    @DeleteMapping
    public ResponseEntity<?> deleteSurvey(@RequestBody Map<String, Object> map) {
        try {
            surveyService.deleteSurveyAndContents((List<String>) map.get("numbers"));
            return ResponseEntity.ok("Survey and related contents deleted Success!");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to delete!");
        }
    }
}
