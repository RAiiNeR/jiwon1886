package kr.co.noorigun.survey;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import kr.co.noorigun.vo.SurveyContentVO;
import kr.co.noorigun.vo.SurveyVO;

@Mapper
public interface SurveyDao {//DB와 상호작용하는 역할
    void addSurvey(SurveyVO vo);//설문조사 추가기능
    List<Map<String,Object>> getSurveyList(Map<String, String> map);//설문조사 리스트 조회기능
    SurveyVO getSurveyByNum(int num);//특정설문조사의 번호 조회기능
    void addSurveyContent(List<SurveyContentVO> list);//설문조사의 내용의 선택옵션 조회
    List<SurveyContentVO> getSurveyContentBySubcode(int subcode);//특정 설문조사 목록 조회
    void deleteSurveyContents(int num);//특정 설문조사의 내용들 삭제
    void deleteSurvey(int num);//설문조사 삭제
    int countAll();
}
