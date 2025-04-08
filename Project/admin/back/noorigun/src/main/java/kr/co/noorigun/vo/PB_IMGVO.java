package kr.co.noorigun.vo;

import org.apache.ibatis.type.Alias;


import lombok.Getter;
import lombok.Setter;

@Alias("pbvo") // mappers의 이름과 동일해야 한다
@Getter
@Setter
public class PB_IMGVO {
    // private int imgnum;
    // private MultipartFile imageFile;
    private int pbnum;       
    private String imgname;
}
