package kr.co.back.board;

import java.util.Date;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Setter
@Getter
public class BoardVO {
    private Long  num;
    private String title;
    private String writer;
    private String content;

    private List<MultipartFile> images; //파일을 받을 자리
    private List<String> imgNames; //파일의 이름을 받을 자리

    private Long hit;
    private Date bdate;
}
