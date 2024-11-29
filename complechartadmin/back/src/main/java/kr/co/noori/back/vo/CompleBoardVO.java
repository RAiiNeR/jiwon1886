package kr.co.noori.back.vo;

import java.util.Date;
import org.apache.ibatis.type.Alias;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Alias("compleboardVO")
public class CompleBoardVO {
    private Long num;
    private String title;
    private String content;
    private Date cdate;
    private String state;
    private Long pri;
    private Long hit;
    private Long pwd;
    private Long deptno;
}
