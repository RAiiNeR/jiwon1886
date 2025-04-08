package kr.co.noorigun.survey;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SurveyVO {
    private Long num; // 설문조사 고유 ID(Primary Key)
    private String sub; // 설문조사 제목 
    private Integer code; // 설문조사 코드
    private List<SurveyContentVO> contents; // 설문 항목 리스트 (SurveyContentVO의 리스트)
}
