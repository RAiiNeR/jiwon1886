package kr.co.admin.member;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/member")
public class MemberController {
    @Autowired
    private MemberService memberService;

    @GetMapping // 회원목록 전체데이터 + 페이징처리
    public ResponseEntity<?> listMember(
        @RequestParam(defaultValue = "1") int page, //시작페이지
        @RequestParam(defaultValue = "10") int size //페이지 나타낼 데이터 수
    ) {
        return ResponseEntity.ok().body(memberService.getMemberListWithPagination(page, size));
    }

    @DeleteMapping
    public ResponseEntity<?> deleteMember(@RequestParam Long num) {
        memberService.delete(num);
        return ResponseEntity.ok().body("회원삭제 완료");
    }

    
}
