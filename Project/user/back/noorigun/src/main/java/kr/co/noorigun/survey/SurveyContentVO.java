package kr.co.noorigun.survey;

import com.fasterxml.jackson.annotation.JsonProperty;


import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
//  @JsonProperty:  JSON 직렬화,역직렬화에 Java 객체의 필드와 JSON 속성 간의 이름, 매핑을 명시적으로 지정
public class SurveyContentVO {
    @JsonProperty("surveytype")
    private String surveytype; // 설문항목 유형
    @JsonProperty("surveytitle")
    private String surveyTitle; // 설문항목 제목
    @JsonProperty("surveycnt")
    private Integer surveyCnt; // 설문항목 응답 수
}
