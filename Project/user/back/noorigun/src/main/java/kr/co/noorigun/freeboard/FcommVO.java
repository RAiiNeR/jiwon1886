package kr.co.noorigun.freeboard;

import java.util.Date;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class FcommVO {
    private Long num; // PK
    private String writer;
    private String comment;
    private Date fcdate;
    private Long fbnum; // 해당 댓글에 속한 게시글 번호(FK)

}
