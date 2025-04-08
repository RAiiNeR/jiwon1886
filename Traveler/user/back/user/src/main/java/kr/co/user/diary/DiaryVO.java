package kr.co.user.diary;

import java.util.Date;
import kr.co.user.member.MemberVO;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Data
public class DiaryVO {
    private Long num;
    private Date ddate;
    private Integer heart;
    private Integer hit;
    private Integer isshare;
    private String thumbnail;
    private String title;
    // private MemberVO member;
    private Long membernum;
    private String diaryemotion;
}
