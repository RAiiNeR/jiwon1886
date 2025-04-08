package kr.co.noorigun.survey;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
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
    public Page<Map<String,String>> getSurveyList(int page, int size) {        
        int begin = (page - 1) * size + 1;
        int end = begin + size - 1;
        Map<String, String> map = new HashMap<>();
        map.put("begin", String.valueOf(begin));
        map.put("end", String.valueOf(end));
        List<Map<String,Object>> maps = surveyDao.getSurveyList(map);//원본 데이터
        List<Map<String,String>> list = new ArrayList<>(); //반환용
        for (Map<String,Object> m : maps) {
            Map<String,String> mm = new HashMap<>();

            for (Map.Entry<String,Object> e : m.entrySet()) {
                mm.put(e.getKey().toLowerCase(), String.valueOf(e.getValue()));
            }

            list.add(mm);
        }
        int totalContents = surveyDao.countAll();
        return new PageImpl(list, PageRequest.of(page - 1, size), totalContents);
    }

    //특정 설문조사의 세부정보
    public SurveyVO getSurvey(int num) {
        List<SurveyContentVO> surveycontent = surveyDao.getSurveyContentBySubcode(num);
        SurveyVO survey = surveyDao.getSurveyByNum(num);
        survey.setContents(surveycontent);
        return survey;
    }

    //특정 설문조사의 세부목록 삭제(여러개도 가능)
    public void deleteSurveyAndContents(List<String> numbers){
        for (String num : numbers) {
            surveyDao.deleteSurveyContents(Integer.parseInt(num));
            surveyDao.deleteSurvey(Integer.parseInt(num));
        }
    }

}
