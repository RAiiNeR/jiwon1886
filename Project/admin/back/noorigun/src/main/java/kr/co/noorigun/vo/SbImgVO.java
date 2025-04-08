package kr.co.noorigun.vo;

import org.apache.ibatis.type.Alias;

import lombok.Getter;
import lombok.Setter;

@Alias("sbimg")
@Getter
@Setter
public class SbImgVO {
    private Long sbnum;
    private String imgname;
}
