package kr.co.user.hotel.vo;

import java.util.Date;
import java.util.List;
import org.springframework.web.multipart.MultipartFile;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Data
public class HotelVO {
    private Long num;
    private String name;
    private Long membernum;
    private Integer rating;
    private String content;
    private String location;
    private MultipartFile thumbnail;
    private Integer hit;
    private Date hdate;
    private List<MultipartFile> images;
    private List<String> imgNames;
}
