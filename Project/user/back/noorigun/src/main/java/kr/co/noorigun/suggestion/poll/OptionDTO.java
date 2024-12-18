package kr.co.noorigun.suggestion.poll;

import lombok.Data;

@Data
public class OptionDTO {
    private Long id;
    private String text;
    private Long votes;
    private String image_url;
    
}
