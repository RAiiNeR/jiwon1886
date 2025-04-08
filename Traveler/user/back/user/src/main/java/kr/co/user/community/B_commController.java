package kr.co.user.community;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import kr.co.user.member.MemberRepository;

@RestController // REST 컨트롤러로 선언 (JSON 응답을 반환)
@RequestMapping("/api/bcomm")
public class B_commController {
    @Autowired
    private B_commService bcommService; // 댓글 관련 서비스

    @Autowired
    private Back_PackRepository backpackRepository; // 게시글(배낭) 관련 리포지토리

    @Autowired
    private MemberRepository memberRepository; // 회원 관련 리포지토리

    @Autowired
    private B_commRepository bcommRepository; // 댓글 관련 리포지토리

    // 댓글 추가 API
    @PostMapping("/add")
    public ResponseEntity<Map<String, Object>> addComment(@RequestBody B_commVO vo) {
        System.out.println("=========================================");
        System.out.println("[DEBUG] 댓글 추가 요청 수신");
        System.out.println("backpacknum: " + vo.getBackpacknum());
        System.out.println("membernum: " + vo.getMembernum());
        System.out.println("content: " + vo.getContent());
        System.out.println("parentnum: " + vo.getParentnum());
        System.out.println("member: " + vo.getMember());
        System.out.println("=========================================");

         // 필수 값 확인
        if (vo.getBackpacknum() == null || vo.getMembernum() == null) {
            System.out.println("[ERROR] backpacknum 또는 membernum 값이 null입니다!");
            return ResponseEntity.badRequest().body(Map.of("error", "오류: backpacknum 또는 membernum 값이 없습니다!"));
        }

        try {
            B_commVO result = bcommService.addComment(vo); // 서비스 호출하여 댓글 저장
            System.out.println("[SUCCESS] 댓글이 성공적으로 추가되었습니다.");

            // 응답 데이터 생성
            Map<String, Object> response = new HashMap<>();
            response.put("num", result.getNum()); // 댓글 ID
            response.put("membernum", result.getMember().getNum()); // 작성자 ID
            response.put("memberName", result.getMember().getName()); // 작성자 이름
            response.put("backpacknum", result.getBackpacknum()); // 게시글 ID
            response.put("parentnum", result.getParentnum()); // 부모 댓글 ID (대댓글이면 값이 있음)
            response.put("content", result.getContent()); // 댓글 내용
            response.put("bdate", result.getBdate()); // 작성 날짜
            response.put("replies", result.getReplies()); // 대댓글 리스트

            return ResponseEntity.ok(response); // 성공 응답 반환
        } catch (Exception e) {
            System.out.println("[ERROR] 서버 내부 오류 발생: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "서버 오류 발생: " + e.getMessage()));
        }
    }

    // 특정 게시글의 모든 댓글 조회 API
    @GetMapping("/list/{backpackNum}")
    public ResponseEntity<Map<String, Object>> getAllBcommByBackpackNum(
            @PathVariable("backpackNum") Integer backpackNum) {

        List<B_commVO> comments = bcommService.getAllCommentsByBackpack(Long.valueOf(backpackNum));

        // 대댓글까지 포함하여 응답 데이터를 가공
        List<Map<String, Object>> processedComments = comments.stream().map(comment -> {
            Map<String, Object> commentData = new HashMap<>();
            commentData.put("num", comment.getNum()); // 댓글 ID
            commentData.put("backpacknum", comment.getBackpacknum()); // 게시글 ID
            commentData.put("parentnum", comment.getParentnum()); // 부모 댓글 ID (대댓글이면 값이 있음)
            commentData.put("content", comment.getContent()); // 댓글 내용
            commentData.put("bdate", comment.getBdate()); // 작성 날짜

            // 작성자 정보 추가
            if (comment.getMember() != null) {
                Map<String, Object> memberData = new HashMap<>();
                memberData.put("num", comment.getMember().getNum()); // 작성자 ID
                memberData.put("name", comment.getMember().getName()); // 작성자 이름
                commentData.put("member", memberData);
            }

            // 대댓글 리스트 추가
            List<Map<String, Object>> replies = comment.getReplies() != null
                    ? comment.getReplies().stream().map(reply -> {
                        Map<String, Object> replyData = new HashMap<>();
                        replyData.put("num", reply.getNum()); // 대댓글 ID
                        replyData.put("parentnum", reply.getParentnum()); // 부모 댓글 ID
                        replyData.put("content", reply.getContent()); // 대댓글 내용
                        replyData.put("bdate", reply.getBdate()); // 대댓글 작성 날짜

                        // 대댓글 작성자 정보 추가
                        if (reply.getMember() != null) {
                            Map<String, Object> replyMemberData = new HashMap<>();
                            replyMemberData.put("num", reply.getMember().getNum()); // 작성자 ID
                            replyMemberData.put("name", reply.getMember().getName()); // 작성자 이름
                            replyData.put("member", replyMemberData);
                        }

                        return replyData;
                    }).toList()
                    : new ArrayList<>();

            commentData.put("replies", replies); // 대댓글 포함

            return commentData;
        }).toList();

        // 응답 데이터 구성
        Map<String, Object> response = new HashMap<>();
        response.put("status", "success"); // 요청 성공 여부
        response.put("totalComments", processedComments.size()); // 총 댓글 수
        response.put("comments", processedComments); // 댓글 목록

        return ResponseEntity.ok(response); // JSON 형식으로 반환
    }

    // 댓글 삭제 (대댓글 포함)
    @DeleteMapping("/delete/{commentId}")
    public ResponseEntity<String> deleteComment(@PathVariable("commentId") Long commentId) {
        bcommService.deleteComment(commentId); // 댓글 삭제 서비스 호출
        return ResponseEntity.ok("댓글이 성공적으로 삭제되었습니다."); // 삭제 성공 메시지 반환
    }

}
