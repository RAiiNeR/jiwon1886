package kr.co.noorigun.survey;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.Setter;

// @Entity와 @Embeddable 어노체이션을 동시에 사용할 수 없다

@Setter
@Getter
@Embeddable // 값 객체 -> 별도의 테이블로 관리되지 않고 Survey에 내재된 형태로 저장(독립적인 엔티티가 아님)

public class SurveyContent { // 설문 조사의 개별 항목
@Column(name ="surveytype")  
 private String surveytype; // 설문항목 유형
 @Column(name ="surveytitle")  
 private String surveyTitle; // 설문항목 제목
 @Column(name ="surveycnt")  
 private Integer surveyCnt; // 설문항목 응답 수
}