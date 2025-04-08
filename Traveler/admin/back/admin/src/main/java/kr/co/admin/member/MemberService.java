package kr.co.admin.member;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
public class MemberService {
    @Autowired
    private MemberRepository memberRepository;

    // 전체조회
    public List<MemberVO> list(){
        return memberRepository.findAllMember();
    }

    // 삭제기능
    public void delete(Long num){
        memberRepository.deleteMemberByNum(num);
    }

    // 회원 페이징
    public Page<MemberVO> getMemberListWithPagination(int page, int size){
        // startRow와 endRow계산
        int startRow = (page - 1) * size + 1;
        int endRow = startRow + size - 1;
        List<MemberVO> entity = memberRepository.findByNumWithPagination(startRow, endRow);

        // 전체 게시글 수 계산 (페이징을 위한)
        Long totalElememts = memberRepository.countAllMember();
        // num이 pk라 Long이기 때문에 null이 아닐 경우 intValue()를 사용하여 Long값을 int로 변환
        int total = (totalElememts != null) ? totalElememts.intValue() : 0;

        // Page 객체로 반환
        return new PageImpl<>(entity, PageRequest.of(page - 1, size), total);
    }



    

    
}
