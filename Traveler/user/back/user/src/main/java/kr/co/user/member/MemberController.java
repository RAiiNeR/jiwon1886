package kr.co.user.member;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/member")
public class MemberController {

    private final MemberService memberService;

    @Autowired
    public MemberController(MemberService memberService) {
        this.memberService = memberService;
    }

    // 일반 회원 가입
    @PostMapping("/register")
    public ResponseEntity<?> registerMember(@ModelAttribute MemberVO memberVO) {
        System.out.println(memberVO);
        System.out.println("회원가입 요청 Role: " + memberVO.getRole());
        System.out.println("   Username: " + memberVO.getUsername());
        System.out.println("   Name: " + memberVO.getName());
        System.out.println("   Email: " + memberVO.getEmail());
        System.out.println("   Phone: " + memberVO.getPhone());
        System.out.println("   Code: " + memberVO.getCode());

        if (memberVO.getRole().equals("COMPANY")) {
            System.out.println("   Company Name: " + memberVO.getCompanyName());
            System.out.println("   Company Type: " + memberVO.getCompanyType());
            memberService.registerCompany(memberVO);
        } else {
            memberService.registerUser(memberVO);
        }

        System.out.println("회원가입 성공");
        return ResponseEntity.ok().build();
    }

    // 아이디 중복 확인
    @PostMapping("/idCheck")
    public ResponseEntity<Boolean> checkIdDuplicate(@RequestBody MemberVO vo) {
        System.out.println("아이디 중복 확인 요청: " + vo.getUsername());

         boolean isDuplicate = memberService.isUsernameDuplicate(vo.getUsername());
         System.out.println("검수 2"+isDuplicate);
        if (isDuplicate) {
            System.out.println("아이디 중복됨: " + vo.getUsername());
            return ResponseEntity.ok(true); // 중복된 아이디가 있으면 true 반환
        } else {
            System.out.println("아이디 사용 가능: " + vo.getUsername());
            return ResponseEntity.ok(false); // 중복되지 않으면 false 반환
        }
   
    }

    // 제휴회사 조회 (사업자등록번호로 조회)
    @GetMapping("/partner/{businessNumber}")
    public ResponseEntity<MemberVO> getPartnerByBusinessNumber(@PathVariable String businessNumber) {
        System.out.println("제휴회사 조회 요청 사업자등록번호: " + businessNumber);

        return memberService.findByCode(businessNumber)
                .map(member -> {
                    System.out.println("제휴회사 조회 성공 Name: " + member.getCompanyName());
                    return ResponseEntity.ok(member);
                })
                .orElseGet(() -> {
                    System.out.println("제휴회사 조회 실패 사업자등록번호 없음");
                    return ResponseEntity.notFound().build();
                });
    }

}

    
