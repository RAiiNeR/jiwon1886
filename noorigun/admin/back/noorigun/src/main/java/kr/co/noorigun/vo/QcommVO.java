package kr.co.noorigun.vo;

import org.apache.ibatis.type.Alias;

import lombok.Getter;
import lombok.Setter;

@Alias("qco")
@Getter
@Setter
public class QcommVO {
    private int num;
    private String writer;
    private String comments;
    private String qcdate;
   
    
}
