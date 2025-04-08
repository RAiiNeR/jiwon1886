package kr.co.noorigun.vo;

import java.util.Date;
import java.util.List;

import org.apache.ibatis.type.Alias;

import lombok.Data;

@Data
@Alias("pollvo")
public class PollVO {
    private Long id;                   // 투표 ID
    private String title;              
    private boolean allowMultiple;     // 복수 선택 가능 여부
    private boolean anonymous;         // 익명 여부
    private Date endDate;              // 종료일
    private Long maxParticipants;      // 최대 참가자 수
    private Long sbnum;             // 연관된 게시글 번호
    private List<PollOptionVO> options; // 투표 옵션 리스트
}
