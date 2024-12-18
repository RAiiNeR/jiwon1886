package kr.co.noorigun.vo;

import org.apache.ibatis.type.Alias;
import lombok.Getter;
import lombok.Setter;

@Alias("fco")
@Getter
@Setter
public class FcommVO {
    private int num;
    private String comments;
    private String fcdate;
    private String writer;
    private Long fbnum;
    
}
