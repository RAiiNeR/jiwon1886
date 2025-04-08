package kr.co.noorigun.survey;

import lombok.Getter;
import lombok.Setter;
// 특정 설문 조사 항목의 응답 수를 업데이트할 때 필요한 데이터를 담는 데이터 전달 객체(DTO)로 사용
@Getter
@Setter
public class UpdateSurveyRequest {
    private Long subcode; // 설문 조사 항목이 속한 설문 조사 ID (Survey의 PK를 참조)
                          // subcode를 통해 특정 설문 조사와 관련된 데이터를 찾아 응답 수를 업데이트 
    private String surveytype; // 설문 조사 항목의 유형 -> SurveyContent의 surveytype 필드와 매핑
                               // 설문 조사 항목 중 특정 항목을 선택해 응답 수를 증가시키기 위해 사용
}
