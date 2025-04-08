package kr.co.noorigun.vo;

import org.apache.ibatis.type.Alias;

import lombok.Data;

@Data
@Alias("PollStatisticsVO") 
public class PollStatisticsVO {
    private String option_text;      // 옵션 텍스트
    private int vote_count;          // 득표 수
    private String poll_title;       // 투표 제목
    private String end_date;         // 종료 날짜
    private boolean allow_multiple;  // 복수 선택 가능 여부
    private Long sbnum;
}
