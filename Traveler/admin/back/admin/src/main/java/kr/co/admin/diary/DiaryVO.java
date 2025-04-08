package kr.co.admin.diary;

import java.util.Date;
import java.util.List;

import kr.co.admin.member.MemberVO;
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

    private String membername;
}
