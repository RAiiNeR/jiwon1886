package kr.co.noorigun.member;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;



@RestController
@RequestMapping("/api/member")
public class MemberController {

    @Autowired
    private MemberService memberService;

    @Autowired
	private PasswordEncoder passwordEncoder; // 비밀번호 암호화를 위한 PasswordEncoder 객체
    
    // 회원가입 요청 처리 -> 클라이언트로부터 회원 정보를 받아 데이터베이스에 저징
    @PostMapping("/signup")
    public ResponseEntity<?> memberjoin(@RequestBody MemberVO memberDTO) {
        // 회원정보 로그 출력
        System.out.println("Member getEmail :"+memberDTO.getEmail());
        System.out.println("Member getName :"+memberDTO.getName());
        System.out.println("Member getUser_id :"+memberDTO.getId());
        System.out.println("Member getPwd :"+memberDTO.getPwd());
        String encodePass = passwordEncoder.encode(memberDTO.getPwd()); // 비밀번호 암호화
        memberDTO.setPwd(encodePass);
        memberService.create(memberDTO); // 회원정보 저장
        return ResponseEntity.ok().build();
    }
	 // 아이디 중복 확인
     @PostMapping("/idCheck")
     public int sendId(@RequestBody MemberVO vo) {
         System.out.println("요청 처리됨"+vo.getId());
         // 아이디 중복 여부 확인
         int checkId = memberService.checkId(vo.getId());
         if (checkId == 0) {
             //중복된 이메일이 없을 때 메일을 전송한다.
             memberService.checkId(vo.getId());
             return 0; // 중복된 아이디가 없을 경우
         }else {
             return 1; // 중복된 아이디가 있을 경우
         }
     }

     // 소셜로그인한 사용자가 있는지 검사
     @PostMapping("/socialCheck")
     public int ckeckMember(@RequestBody MemberVO vo) {
         // 아이디 중복 여부 확인
         int checkId = memberService.ckeckMember(vo);
         if (checkId == 0) {
             return 0; // 조건에 맞는 사용자가 없을 경우
         }else {
             return 1; // 조건에 맞는 사용자가 있을 경우
         }
     }

}

    
