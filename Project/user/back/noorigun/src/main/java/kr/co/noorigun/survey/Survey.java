package kr.co.noorigun.survey;

import java.util.Date;
import java.util.List;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
/*
* survey가 메인 엔티티가 되고, surveycontent는 @Embeddable 클래스로 구현
* @ElementCollection을 사용하여 survey와 surveycontent 간의 일대다 관계를 설정
* @ElementCollection은 별도의 식별자를 가질 수 없고, 항상 부모 엔티티에 종속적이라는 것이다
* 만약 surveycontent 에 독립적인 식별자가 필요하다면, 대신 @Entity와 @OneToMany 관계를 사용하는 것이 더 적절할 수 있다
*/

@Setter
@Getter
@Entity // Survey 클래스 데이터베이스 테이블과 매핑
@Table(name = "survey") // 데이터베이스의 survey 테이블과 매핑
public class Survey {
    @Id // PK
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "survey_seq")
    @SequenceGenerator(name = "survey_seq", sequenceName = "survey_seq", allocationSize = 1)

    private Long num; // 설문조사 고유 ID(Primary Key)
    private String sub; // 설문조사 제목 
    private Integer code; // 설문조사 코드
    private Date sdate; // 설문조사 생성 날짜

    @ElementCollection // 설문 내용이 내재된 형태로 포함, 데이터베이스에서 surveycontent 리스트를 테이블로 관리
                       // -> DB에서 Survey와 SurveyContent는 서로 소유 관계(Survey를 저장하면 SurveyContent도 저장, 삭제하면 삭제)
                       // Survey의 키(subcode)를 통해 SurveyContent와 연결
    @CollectionTable(
        name = "surveycontent", // 설문항목 리스트
        joinColumns = @JoinColumn(name="subcode")
    )
    private List<SurveyContent> contents; // 설문 항목 리스트 (SurveyContentVO의 리스트)

}
