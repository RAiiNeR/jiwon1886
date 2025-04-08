package kr.co.noorigun.mypage;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import kr.co.noorigun.member.Member;


@RestController
@RequestMapping("/api/mypage")
public class MyPageController {
    @Autowired
    private MyPageService myPageService;

    @GetMapping
    public List<Member> getAll() {
        return myPageService.getAll(); // 전체 사용자 데이터를 반환
    }

    //나의 페이지에 회원이 신청한 프로그램 확인 2024-12-12
    @GetMapping("/program")
    public ResponseEntity<Map<String, Object>> getProgram(@RequestParam Long num) {
        try {
            // 회원 번호로 해당 프로그램 목록을 가져오는 서비스 호출
            List<Map<String, String>> programList = myPageService.programList(num);
            Map<String, Object> response = new HashMap<>();
            response.put("programList", programList); // 프로그램 리스트 반환
            return ResponseEntity.ok(response); // 200 OK 응답 반환
        } catch (RuntimeException e) {
            System.err.println("Error: " + e.getMessage());
            return ResponseEntity.notFound().build(); // 예외가 발생하면 404 응답 반환
        }
    }
 //---------------------------------------//// 여기까지

    @GetMapping("/detail")
    public ResponseEntity<Map<String, Object>> getList(@RequestParam String id) {
        try {
            Member myPage = myPageService.getList(id); // Member 객체 반환
            
            Map<String, String> myComple = myPageService.myComple(id);
            Map<String, String> mySuggestion = myPageService.mySuggestion(id);
            Map<String, Object> response = new HashMap<>();
            response.put("user", myPage); //사용자 정보 반환
            response.put("mycomple",myComple);
            response.put("mysuggestion", mySuggestion);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            System.err.println("Error: " + e.getMessage());  // 예외 로그
        return ResponseEntity.notFound().build(); // 사용자 없으면 404 반환
        }
    }

    @PostMapping("/update")
    public Member update(@RequestParam("id") String id, @RequestBody Member myPageVO) {
        // MyPageVO에서 받아온 나머지 정보를 사용하여 업데이트
        myPageService.update(
            id,  // URL에서 받은 id
            // myPageVO.getName(),
            myPageVO.getPhone(),
            myPageVO.getEmail(),
            myPageVO.getAddr()
        );
        return myPageVO;  // 그대로 반환
    }

    //사용자의 부서별 글 상태 갯수 조회
}

