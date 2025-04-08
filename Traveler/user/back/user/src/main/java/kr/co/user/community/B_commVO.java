package kr.co.user.community;

import java.util.List;

import kr.co.user.member.MemberVO;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class B_commVO {
    private Long num; // PK
    private Integer membernum; // 댓글을 작성한 회원의 ID
    private MemberVO member; // 댓글 작성자의 회원 정보 (회원 객체를 포함)
    private Long backpacknum; // 댓글이 속한 게시글 ID
    private Long parentnum; // 부모 댓글 ID (NULL이면 일반 댓글, 값이 있으면 대댓글)
    private String content; // 댓글 내용
    private String bdate; // 댓글 작성 날짜 및 시간
    private List<B_commVO> replies; // 대댓글 목록 (프론트엔드에서 계층 구조로 보여주기 위해 사용)
}