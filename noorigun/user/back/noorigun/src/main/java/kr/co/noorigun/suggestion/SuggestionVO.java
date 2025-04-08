package kr.co.noorigun.suggestion;

import java.sql.Date;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
@Data
@Getter
@Setter
public class SuggestionVO {
     private Long num;
    private String title;
    private String writer;
    private String content;
    private List<MultipartFile> images; // 업로드하는 파일 처리   
    private List<String> imgNames; // DB에서 자뎌온 이미지 파일 이름 관리
    private Long hit;
    private Date sdate;
    private String state;
    private Long mnum;
}
