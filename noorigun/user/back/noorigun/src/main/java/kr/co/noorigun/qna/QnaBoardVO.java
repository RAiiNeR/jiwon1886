package kr.co.noorigun.qna;

import java.util.Date;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;


@Data
@Setter
@Getter
public class QnaBoardVO {
    private Long num; 
    private String title;
    private String writer;
    private String content;
    private int hit;
    private Date qdate;
    private Long parentnum; // 부모 게시글 번호(답변 형태의 게시판일 경우 사용)
    private Long mnum; // 회원번호
}

