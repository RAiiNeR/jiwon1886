package kr.co.noorigun.vo;

import org.apache.ibatis.type.Alias;
import lombok.Getter;
import lombok.Setter;

@Alias("updateSurvey")
@Getter
@Setter
public class UpdateSurveyRequest {
    private Long subcode;
    private String surveytype;
    
}

