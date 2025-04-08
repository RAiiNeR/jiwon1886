package kr.co.noorigun.vo;

import org.apache.ibatis.type.Alias;

import lombok.Getter;
import lombok.Setter;

@Alias("sco")
@Getter
@Setter
public class ScommVO {
    private int num;
    private String writer;
    private String comments;
    private String scdate;
    private Long sbnum;
}
