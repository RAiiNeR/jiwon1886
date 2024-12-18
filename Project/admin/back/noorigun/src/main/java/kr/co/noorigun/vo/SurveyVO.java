package kr.co.noorigun.vo;

import java.util.List;
import org.apache.ibatis.type.Alias;
import lombok.Getter;
import lombok.Setter;

@Alias("survey")
@Getter
@Setter
public class SurveyVO {
  
    private Long num;
    private String sub;
    private Integer code;
    private List<SurveyContentVO> contents;
    private String sdate;
}
