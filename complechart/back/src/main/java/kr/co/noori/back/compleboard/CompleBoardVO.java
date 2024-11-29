package kr.co.noori.back.compleboard;

import java.util.Date;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
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
