package kr.co.admin.diary;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class DiarypageVO {
    private Long num;
    private String imgname;
    private String content;
    private Double embressed;
    private Double happy;
    private String location;
    private Double neutrality;
    private Integer page;
    private String ptitle;
    private Double sad;
    private Double upset;
    private Long diarynum;
    private String emotion;
}
