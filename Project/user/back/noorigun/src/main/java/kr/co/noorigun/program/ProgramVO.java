package kr.co.noorigun.program;

import java.util.Date;

import org.springframework.web.multipart.MultipartFile;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Setter
@Getter
public class ProgramVO {

    private Long num;
    private String title;
    private Long age;
    private String content;
    private String place;
    private String category;
    private String teacher; // 강사
    private Long student; // 수강생
    private Long education; // 교육정원
    // 사진 첨부를 위한 수정
    private MultipartFile mfile;
    private String img;

    private Date startperiod;
    private Date endperiod;

    private Date startdeadline;
    private Date enddeadline;

    private String starttime;
    private String endtime;

    private Long hit;
    private String pdate; // 게시글 작성일

}