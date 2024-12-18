package kr.co.noorigun.vo;

import java.util.List;

import org.apache.ibatis.type.Alias;
import org.springframework.web.multipart.MultipartFile;

import lombok.Getter;
import lombok.Setter;

@Alias("pvo") // mappers의 이름과 동일해야 한다
@Getter
@Setter
public class PromoteBoardVO {
    private int num;
    private String title;
    private String writer;
    private String content;
    private int hit;
    private String pdate;
    private List<MultipartFile> mfiles;
    private List<String> imgNames;
    private String placeaddr;
    private String placename;
    private double latitude;
    private double longitude;
}
