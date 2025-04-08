package kr.co.user.community;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.co.user.member.MemberRepository;
import kr.co.user.member.MemberVO;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class B_commService {
    @Autowired
    private B_commRepository bcommRepository;

    @Autowired
    private Back_PackRepository backpackRepository;

    @Autowired
    private MemberRepository memberRepository;

    // 댓글 추가 메서드
    @Transactional
    public B_commVO addComment(B_commVO vo) {
        System.out.println("=========================================");
        System.out.println("[DEBUG] 댓글 추가 요청 수신");
        System.out.println("backpacknum: " + vo.getBackpacknum());
        System.out.println("membernum: " + vo.getMembernum());
        System.out.println("content: " + vo.getContent());
        System.out.println("parentnum: " + vo.getParentnum());
        System.out.println("=========================================");
    
        // 필수 값이 없을 경우 예외 발생
        if (vo.getBackpacknum() == null || vo.getMembernum() == null) {
            System.out.println("[ERROR] backpacknum 또는 membernum 값이 null입니다!");
            throw new RuntimeException("backpacknum 또는 membernum 값이 없습니다!");
        }
    
        // 해당 게시글 조회 (없으면 예외 발생)
        Back_Pack backpack = backpackRepository.findById(vo.getBackpacknum())
                .orElseThrow(() -> new RuntimeException("해당 게시글을 찾을 수 없습니다."));
    
        // 회원 정보 조회 (없으면 예외 발생)
        Optional<MemberVO> memberOptional = memberRepository.findById(vo.getMembernum().longValue());
        if (memberOptional.isEmpty()) {
            System.out.println("ERROR: membernum " + vo.getMembernum() + "에 해당하는 사용자 없음!");
            throw new RuntimeException("해당 membernum에 해당하는 사용자가 없습니다!");
        }
    
        MemberVO member = memberOptional.get();
        System.out.println("member 조회 성공: " + member.getName());
    
        // 댓글 객체 생성 및 설정
        B_comm comment = new B_comm();
        comment.setContent(vo.getContent());
        comment.setBdate(LocalDateTime.now());
        comment.setBackpack(backpack);
        comment.setMember(member);
    
        // 부모 댓글이 있는 경우 설정
        if (vo.getParentnum() != null && vo.getParentnum() > 0) {
            B_comm parentComment = bcommRepository.findById(vo.getParentnum())
                    .orElseThrow(() -> new RuntimeException("부모 댓글을 찾을 수 없습니다."));
            comment.setParent(parentComment);
        }
    
        // 댓글 저장
        B_comm addComm = bcommRepository.save(comment);
    
        if (addComm.getMember() == null) {
            System.out.println("ERROR: 저장된 댓글의 member가 NULL!");
        } else {
            System.out.println("저장된 댓글의 작성자: " + addComm.getMember().getName());
        }
    
        // 저장된 댓글 정보를 VO로 변환하여 반환
        B_commVO resultVO = new B_commVO();
        resultVO.setNum(addComm.getNum());
        resultVO.setMembernum(addComm.getMember().getNum()); 
        resultVO.setBackpacknum(addComm.getBackpack().getNum());
        resultVO.setParentnum(addComm.getParent() != null ? addComm.getParent().getNum() : null);
        resultVO.setContent(addComm.getContent());
        resultVO.setBdate(addComm.getBdate().toString());
    
        MemberVO responseMember = new MemberVO();
        responseMember.setNum(addComm.getMember().getNum());
        responseMember.setName(addComm.getMember().getName());
        resultVO.setMember(responseMember);
    
        return resultVO;
    }
    

    // 댓글 목록 조회 (부모 댓글만 먼저 조회하고, 대댓글은 따로 조회)
    public List<B_commVO> getAllCommentsByBackpack(Long backpackNum) {
        List<B_comm> topLevelComments = bcommRepository.findTopLevelCommentsByBackpackNum(backpackNum);
        List<B_commVO> result = new ArrayList<>();
    
        // 부모 댓글 처리
        for (B_comm comment : topLevelComments) {
            B_commVO commentVO = new B_commVO();
            commentVO.setNum(comment.getNum());
            commentVO.setContent(comment.getContent());
            commentVO.setBdate(comment.getBdate().toString());
            commentVO.setParentnum(comment.getParent() != null ? comment.getParent().getNum() : null);
    
             // 작성자 정보 추가
            if (comment.getMember() != null) {
                MemberVO responseMember = new MemberVO();
                responseMember.setNum(comment.getMember().getNum());
                responseMember.setName(comment.getMember().getName());
                commentVO.setMember(responseMember);
            }
    
            // 대댓글 조회 및 설정
            List<B_commVO> replyVOs = getRepliesForComment(comment.getNum());
            commentVO.setReplies(replyVOs); // 대댓글 리스트를 설정
            result.add(commentVO);
        }
    
        return result;
    }
    
    // 특정 댓글의 대댓글을 가져오는 메서드 추가
    private List<B_commVO> getRepliesForComment(Long parentNum) {
        List<B_comm> replies = bcommRepository.findRepliesByParentNum(parentNum);
        List<B_commVO> replyVOs = new ArrayList<>();
    
        for (B_comm reply : replies) {
            B_commVO replyVO = new B_commVO();
            replyVO.setNum(reply.getNum());
            replyVO.setContent(reply.getContent());
            replyVO.setBdate(reply.getBdate().toString());
            replyVO.setParentnum(reply.getParent() != null ? reply.getParent().getNum() : null);
    
            // 작성자 정보 추가
            if (reply.getMember() != null) {
                MemberVO replyMember = new MemberVO();
                replyMember.setNum(reply.getMember().getNum());
                replyMember.setName(reply.getMember().getName());
                replyVO.setMember(replyMember);
            }
    
            // 대댓글의 대댓글도 조회
            replyVO.setReplies(getRepliesForComment(reply.getNum()));
            replyVOs.add(replyVO);
        }
    
        return replyVOs;
    }
    
    // 댓글 개수 조회
    public long getCommentCount(Long backpackNum) {
        return bcommRepository.countByBackpackNum(backpackNum);
    }

    // 댓글 및 대댓글 삭제
    public void deleteComment(Long commentId) {
        B_comm comment = bcommRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("해당 댓글을 찾을 수 없습니다."));

        if (comment.getParent() == null) {
            // 부모 댓글이면 대댓글도 모두 삭제
            bcommRepository.deleteByParent(comment);
        }

        // 현재 댓글 삭제
        bcommRepository.delete(comment);
    }

}
