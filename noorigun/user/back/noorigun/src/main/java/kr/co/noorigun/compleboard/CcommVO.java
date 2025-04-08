package kr.co.noorigun.compleboard;

import java.util.Date;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Setter
@Getter
public class CcommVO {
    private Long num;
    private String writer;
    private String comments;
    private Date ccdate;
    private Long cbnum; // 해당 댓글아 속한 개시글 번호
}
