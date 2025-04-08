package kr.co.noorigun.vo;

import org.apache.ibatis.type.Alias;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Alias("surveyContent")
@Setter
@Getter
public class SurveyContentVO {

    private int subcode;

    @JsonProperty("surveytype")
    private String surveytype;

    @JsonProperty("surveytitle")
    private String surveyTitle;

    @JsonProperty("surveycnt")
    private Integer surveyCnt;
}
