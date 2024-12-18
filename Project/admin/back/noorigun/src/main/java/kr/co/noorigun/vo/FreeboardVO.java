package kr.co.noorigun.vo;

import org.apache.ibatis.type.Alias;

import lombok.Getter;
import lombok.Setter;

@Alias("fvo")
@Getter
@Setter
public class FreeboardVO {
    private int num;
    private String title;
    private String writer;
    private String content;
    private int hit;
    private String fdate;

    
}
