package kr.co.noorigun.member;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.co.noorigun.security.Role;

@Service
public class MemberService{
    @Autowired
    private MemberRepository memberRepository;

    public void create(MemberVO vo) {
        // Member 엔티티 객체 생성
        Member entity = new Member();
        entity.setName(vo.getName());
        entity.setId(vo.getId());
        entity.setPwd(vo.getPwd());
        entity.setSsn(vo.getSsn()); // 주민번호
        entity.setPhone(vo.getPhone());
        entity.setEmail(vo.getEmail());
        entity.setAddr(vo.getAddr());
        entity.setSocialuser(vo.getSocialuser());
        entity.setMdate(new Date()); // 가입일 설정
        entity.setRole(Role.USER); // 기본 Role 설정 (USER)
        memberRepository.save(entity); // 입력받은 회원 정보를 데이터베이스에 저장
    }

    // 이메일 중복확인
    public int checkEmailDuplicate(String email) {
        return memberRepository.countByEmail(email); // 0이면 중복되지 않음, 1 이상이면 중복
    }

    // 아이디 중복 확인
    public int checkId(String id) {
        return memberRepository.checkId(id); // 0이면 중복되지 않음, 1 이상이면 중복
    }

    // 사용자 중복 확인
    public int ckeckMember(MemberVO vo) {
        return memberRepository.ckeckMember(vo.getName(),vo.getEmail(),vo.getPhone()); // 0이면 중복되지 않음, 1 이상이면 중복
    }

    public Member findMember(String id) {
        return memberRepository.findById(id).get();
    }

    public void changepwd(Member vo) {
        memberRepository.save(vo);
    }
}