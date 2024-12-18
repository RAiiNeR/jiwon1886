package kr.co.noorigun.survey;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import kr.co.noorigun.vo.SurveyContentVO;
import kr.co.noorigun.vo.SurveyVO;

@Service
@Transactional
public class SurveyService {

    //비즈니스 로직 작성을 위한
    @Autowired
    private SurveyDao surveyDao;

    //설문조사 저장
    public void saveSurvey(SurveyVO survey) {
        char surveytype = 'A';
        for (SurveyContentVO e : survey.getContents()) {
            e.setSurveytype(String.valueOf(surveytype));
            surveytype++;
        }
        surveyDao.addSurvey(survey);
        surveyDao.addSurveyContent(survey.getContents());
    }

    //설문조사 조회
    public List<Map<String,String>> getSurveyList() {
        List<Map<String,Object>> maps = surveyDao.getSurveyList();//원본 데이터

        List<Map<String,String>> list = new ArrayList<>(); //반환용

        for (Map<String,Object> map : maps) {
            Map<String,String> m = new HashMap<>();

            for (Map.Entry<String,Object> e : map.entrySet()) {
                m.put(e.getKey().toLowerCase(), String.valueOf(e.getValue()));
            }

            list.add(m);
        }
        return list;
    }

    //특정 설문조사의 세부정보
    public SurveyVO getSurvey(int num) {
        List<SurveyContentVO> surveycontent = surveyDao.getSurveyContentBySubcode(num);
        SurveyVO survey = surveyDao.getSurveyByNum(num);
        survey.setContents(surveycontent);
        return survey;
    }

    //특정 설문조사의 세부목록 삭제(여러개도 가능)
    public void deleteSurveyAndContents(List<Integer> numbers){
        for (Integer num : numbers) {
            surveyDao.deleteSurveyContents(num);
            surveyDao.deleteSurvey(num);
        }
    }

}
