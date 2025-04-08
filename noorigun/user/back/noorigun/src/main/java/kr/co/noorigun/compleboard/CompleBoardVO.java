package kr.co.noorigun.compleboard;

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
    private List<MultipartFile> images; // 업로드된 이미지 파일
    private List<String> imgNames; // 저장된 이미지 파일 이름
    private Date cdate;
    private String state; // 게시글 상태(처리중/완료)
    private Long pri; // 게시글 공개 여부
    private Long hit;
    private Long pwd;
    private Long deptno; // 부서번호
    private Long mnum; // 사용자 번호
}
