package kr.co.mypage.back.compleboard;

import java.util.Date;
import java.util.List;
import org.springframework.web.multipart.MultipartFile;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Setter
@Getter
public class CompleBoardVO {
    private Long num; 
    private String title;
    private String writer;
    private String content;
    private List<MultipartFile> images;
    private List<String> imgNames;
    private Date cdate;
    private String state; // 게시글 상태(활성화/비활성화)
    private Long pri; // 게시글 공개 여부
    private Long hit;
    private Long pwd;
    private Long deptno;
}
