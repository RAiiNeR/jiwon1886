package kr.co.noorigun.vo;

import org.apache.ibatis.type.Alias;

import lombok.Getter;
import lombok.Setter;

@Alias("ccvo")
@Getter
@Setter
public class CcommVO {
    private int num;
    private String writer;
    private String comments;
    private String ccdate;
    private Long cbnum;
}
