package kr.co.noorigun.vo;

import org.apache.ibatis.type.Alias;
import org.springframework.web.multipart.MultipartFile;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Alias("banner")
public class BannerVO {
    private int num;
    private String imgname;
    private MultipartFile image;
}
