package kr.co.noorigun.vo;

import org.apache.ibatis.type.Alias;

import lombok.Data;

@Data
@Alias("polloptionvo")
public class PollOptionVO {
    private Long id;         // 옵션 ID
    private String text;     // 옵션 텍스트
    private Long votes;      // 투표 수
    private Long pollId;     // 연관된 투표 ID
    private String image_url; // 이미지 URL
}
