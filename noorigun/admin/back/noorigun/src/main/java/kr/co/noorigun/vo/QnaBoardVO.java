package kr.co.noorigun.vo;

import org.apache.ibatis.type.Alias;

import lombok.Getter;
import lombok.Setter;

@Alias("qvo") // mappers의 이름과 동일해야 한다
@Getter
@Setter
public class QnaBoardVO {
    private int num;
    private String title;
    private String writer;
    private String content;
    private int hit;
    private String qdate;
    private int parentNum; 
}
