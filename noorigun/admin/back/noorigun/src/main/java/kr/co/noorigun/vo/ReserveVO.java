package kr.co.noorigun.vo;

import org.apache.ibatis.type.Alias;

import lombok.Getter;
import lombok.Setter;

@Alias("reserve")
@Setter
@Getter
public class ReserveVO {
    private String reuid;
    private String rname;
    private String requip;
    private int recnt;
    private String remail;
}
