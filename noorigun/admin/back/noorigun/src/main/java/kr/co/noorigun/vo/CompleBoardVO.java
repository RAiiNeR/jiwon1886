package kr.co.noorigun.vo;

import java.util.Date;
import java.util.List;

import org.apache.ibatis.type.Alias;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Alias("compleboardVO")
public class CompleBoardVO {
    private Long num;
    private String title;
    private String writer;
    private String content;
    private Date cdate;
    private String state;
    private Long pri;
    private Long hit;
    private Long pwd;
    private String imgNames;
    private List<String> imgNamesList;
    private Long deptno;
}
