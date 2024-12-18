package kr.co.noorigun.vo;

import org.apache.ibatis.type.Alias;
import lombok.Getter;
import lombok.Setter;

@Alias("faq")
@Getter
@Setter
public class FaqVO {

    private int num;
    private String title;
    private String answer;
    private String category;
    
}
