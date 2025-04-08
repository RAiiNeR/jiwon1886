package kr.co.noorigun.member;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import kr.co.noorigun.vo.MemberVO;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/api/member")
public class MemberContoller {
    @Autowired
    private MemberService memberService;

    //전체 회원 목록
    @GetMapping
    public List<MemberVO> listMember() {
        return memberService.list();
    }

    //전체 회원 수
    @GetMapping("/count")
    public int countMember() {
        return memberService.count();
    }

    @GetMapping("/increment")
    public Map<String,String> incrementChart() {
        return memberService.incrementChart();
    }
    

    //선택한 회원 삭제
    @DeleteMapping
    public ResponseEntity<?> deleteMember(@RequestParam int num) {
        memberService.delete(num);
        return ResponseEntity.ok().body("Delete Success");
    }
}
