package kr.co.test.test.vo;

import org.apache.ibatis.type.Alias;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Alias("boardVO")
public class BoardVO {
    private int num;
    private String title;
    private String writer;
    private String content;
    private int hit;
    private String bdate;
}
