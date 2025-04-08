package kr.co.noorigun.survey;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class SurveyService {
    @Autowired
    private SurveyRepository surveyRepository;

    public Survey saveSurvey(Survey survey){
        return surveyRepository.save(survey); // 설문조사 데이터 저장
    }

    public SurveyVO getLatestSurvey(){
        List<Object[]> result = surveyRepository.findLatestSurveyWithContents(); // 최신 설문 조사 조회 및 변환

        if (result.isEmpty()) {
            return null; // 데이터가 없으면 null 반환
        }
        SurveyVO surveyVO = new SurveyVO();
        List<SurveyContentVO> contentVOList = new ArrayList<>();

        // 첫번째 행을 기준으로 survey 정보(데이터)를 설정
        Object[] firstRow = result.get(0);
        surveyVO.setNum((Long) firstRow[0]);
        surveyVO.setSub((String) firstRow[1]); // survey.sub
        surveyVO.setCode((Integer) firstRow[2]); // survey.code

        // SurveyContentVO 리스트 설정
        for (Object[] row : result) {
            SurveyContentVO contentVO = new SurveyContentVO();
            contentVO.setSurveytype((String) row[4]); // surveycontent.surveytype
            contentVO.setSurveyTitle((String) row[6]); // surveycontent.surveytitle
            contentVO.setSurveyCnt((Integer) row[7]); // surveycontent.surveycnt
            contentVOList.add(contentVO);
        }
        surveyVO.setContents(contentVOList);
        return surveyVO;
    }
    public void updateSurveyCount(Long subcode, String surveytype){
        surveyRepository.incrementSurveyCount(subcode, surveytype); // 응답 수 증가
    }

    public SurveyVO getSurveyByNum(Long num){
        List<Object[]> result = surveyRepository.findByNumSurveyWithContents(num); // 특정 설문조사 조회 및 반환

        if (result.isEmpty()) {
            return null; // 데이터가 없으면 null 반환
        }
        SurveyVO surveyVO = new SurveyVO();
        List<SurveyContentVO> contentVOList = new ArrayList<>();

        // 첫번째 행을 기준으로 survey 정보(데이터)를 설정
        Object[] firstRow = result.get(0);
        surveyVO.setNum((Long) firstRow[0]);
        surveyVO.setSub((String) firstRow[1]);
        surveyVO.setCode((Integer) firstRow[2]);

        // SurveyContentVO 리스트 설정
        for (Object[] row : result) {
            SurveyContentVO contentVO = new SurveyContentVO();
            contentVO.setSurveytype((String) row[4]);
            contentVO.setSurveyTitle((String) row[6]);
            contentVO.setSurveyCnt((Integer) row[7]);
            contentVOList.add(contentVO);
        }
        surveyVO.setContents(contentVOList);
        return surveyVO;
    }
    public List<Map<String,String>> getList(){
        return surveyRepository.findAllByOrderByNumDesc(); // 모든 설문조사 조회
    }
}
