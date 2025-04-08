package kr.co.noorigun.survey;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController // JSON 형식 응답 반환
@RequestMapping("/api/survey")
public class SurveyController {
    @Autowired // 의존성 주입 -> Service 연결
    private SurveyService surveyService;

    // 설문 조사 데이터를 추가하는 API
    @PostMapping("/addsurvey")
    public ResponseEntity<Survey> addsurvey(@RequestBody SurveyVO vo) { //JSON 형식을 SurveyVO 객체로 변환해 전달받음

        try {
            Survey survey = new Survey();  // Survey 엔티티 생성 -> 클라이언트로부터 전달받은 데이터를 기반으로 새로운 설문 조사 생성
            survey.setSub(vo.getSub()); // 설문제목(SurveyVO의 sub 값을 Survey 엔티티의 sub에 설정)
            survey.setCode(vo.getCode()); // 설문코드(SurveyVO의 code 값을 Survey 엔티티의 code에 설정)
            survey.setSdate(new Date()); // 설문 조사 생성 날짜를 현재 날짜로 설정

            List<SurveyContent> contents = new ArrayList<>();
            char stype = 'A'; // 설문 항목의 유형 초기값
            for (int i = 0; i < vo.getContents().size(); i++) {
                SurveyContentVO contentVO = vo.getContents().get(i); // SurveyContentVO 가져오기
                SurveyContent content = new SurveyContent();  // SurveyContent 객체 생성
                content.setSurveytype(String.valueOf(stype));
                content.setSurveyTitle(contentVO.getSurveyTitle());
                System.out.println("getSurveyTitle:" + contentVO.getSurveyTitle());
                content.setSurveyCnt(0); // 초기값 0으로 설정
                contents.add(content); // 리스트에 추가
                stype++; // 다음 항목의 유형으로 증가
            }
            survey.setContents(contents); // Survey에 SurveyContent 리스트 설정
            Survey savedSurvey = surveyService.saveSurvey(survey);
            return ResponseEntity.ok(savedSurvey); // 저장된 Survey 객체 반환
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // 모든 설문조사를 조회하는 API
    @GetMapping
    public Page<Map<String,String>> getSurveyList(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        return surveyService.getList(page,size); // 서비스에서 모든 설문 조사 리스트를 조회
    }

    // 가장 최근의 설문 조사를 조회하는 API
    @GetMapping("/latest")
    public ResponseEntity<SurveyVO> getLatessurvey() {
        SurveyVO surveyVO = surveyService.getLatestSurvey();
        if (surveyVO != null) {
            return ResponseEntity.ok(surveyVO); // 최신 설문조사 데이터가 있으면 JSON 형태로 반환
        } else {
            return ResponseEntity.noContent().build();
        }
    }

     // 특정 설문 항목의 응답 수를 증가시키는 API
    @PostMapping("/updateCount")
    public ResponseEntity<?> updateSurveyCount(@RequestBody UpdateSurveyRequest request) {
        try {
            surveyService.updateSurveyCount(request.getSubcode(), request.getSurveytype());
            return ResponseEntity.ok("Survey count 수정성공");
        } catch (Exception e) {
            return ResponseEntity.status(500).body(" update survey count 실패");
        }
    }

    @GetMapping("/result/{num}")
    // num 으로 받아와서 (num) 추가하기
    // @PathVariable: URL 경로에 포함된 변수 값을 메서드의 파라미터로 매핑(URL 경로의 특정 부분을 변수로 처리(ex) /api/survey/result/5))
    public ResponseEntity<SurveyVO> getSurveyResult(@PathVariable Long num) {
        SurveyVO surveyVO = surveyService.getSurveyByNum(num);
        if (surveyVO != null) {
            return ResponseEntity.ok(surveyVO);
        } else {
            return ResponseEntity.noContent().build();
        }
    }

    @GetMapping("/{num}")
    // num 으로 받아와서 (num) 추가하기!!
    // 특정 설문 조사를 조회하는 API (결과와 유사하지만 다른 용도로 사용 가능)
    public ResponseEntity<SurveyVO> getSurvey(@PathVariable Long num) {
        SurveyVO surveyVO = surveyService.getSurveyByNum(num);
        if (surveyVO != null) {
            return ResponseEntity.ok(surveyVO);
        } else {
            return ResponseEntity.noContent().build();
        }
    }
}
