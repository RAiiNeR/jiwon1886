package kr.co.noorigun.vo;

import org.apache.ibatis.type.Alias;

import lombok.Getter;
import lombok.Setter;

@Alias("notification")
@Getter
@Setter
public class NotificationVO {
    private int num;
    private int deptno;
    private int type;
    private String title;
    private String content;
    private int hit;
    private String ndate;
}
