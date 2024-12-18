package kr.co.noorigun.promote;

import java.util.Date;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class PromoteBoardVO {
    private int num;
    private String title;
    private String writer;
    private String content;
    private int hit;
    private Date pdate;
    private List<MultipartFile> images;
    private List<String> imgNames;
}
