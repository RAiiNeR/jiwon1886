package kr.co.ictstudy.back.gallery;

import java.util.Date;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Setter
@Getter
public class GalleryVO {
    private Long id;
    private String writer;
    private String title;
    private String description;
    private List<MultipartFile> images;
    private List<String> imgNames;
    private Date gdate;
}
