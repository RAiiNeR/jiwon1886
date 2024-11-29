package kr.co.ictstudy.back.memo;

import java.util.Date;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class MemoVO {
    private Long id;
    private String title;
    private String writer;
    private String memocont;
    private Date mdate;
}
