package kr.co.user.mypage;

import kr.co.user.member.MemberVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/mypage")
public class MypageController {
    @Autowired
    private MypageService mypageService;

    // @PostMapping
    // public ResponseEntity<?> getAllMypageInfo(@RequestBody Map<String, String>
    // requestData) {
    // String username = requestData.get("username");
    // String email = requestData.get("email");

    // Map<String, Object> result = new HashMap<>();
    // // 사용자 정보 조회
    // Map<String, Object> user = mypageService.getUser(username);
    // if (user != null) {
    // result.put("userInfo", user);
    // } else {
    // result.put("userInfo", "사용자를 찾을 수 없습니다.");
    // }

    // // 사용자가 올린 최신 3개의 여행 블로그 글 조회
    // List<String> recentBackPacks = mypageService.findRecentBackPack(username);
    // result.put("recentBackPacks", recentBackPacks);

    // // 사용자가 최근 작성한 일기 제목 4개 조회
    // List<String> recentDiaries = mypageService.getRecentDiaries(username);
    // result.put("recentDiaries", recentDiaries);

    // // 사용자의 호텔 예약 내역 5개
    // List<String> hotelReservations = mypageService.getHotelReserve(email);
    // result.put("hotelReservations", hotelReservations);

    // // 4. 최근 본 여행 콘텐츠 3개 조회
    // List<String> recentTourContents =
    // mypageService.getRecentTourContents(username);
    // result.put("recentTourContents", recentTourContents);

    // // 5. 최근 본 호텔 콘텐츠 3개 조회
    // List<String> recentHotelContents =
    // mypageService.getRecentHotelContents(username);
    // result.put("recentHotelContents", recentHotelContents);

    // // 2. 사용자의 최신 5개 질문 (챗봇과의 대화)
    // List<String> recentUserQuestionsFromBot =
    // mypageService.getRecentUserQuestionsFromLogs(username, true);
    // result.put("recentUserQuestionsFromBot", recentUserQuestionsFromBot);

    // // 3. 사용자의 최신 5개 질문 (관리자와의 대화)
    // List<String> recentUserQuestionsFromAdmin =
    // mypageService.getRecentUserQuestionsFromLogs(username, false);
    // result.put("recentUserQuestionsFromAdmin", recentUserQuestionsFromAdmin);

    // return ResponseEntity.ok(result);
    // }

    @GetMapping("/{num}")
    public ResponseEntity<?> getAllMypageInfo(@PathVariable("num") Integer num) {
        Map<String, Object> result = new HashMap<>();
        // 사용자 정보 조회
        Map<String, Object> user = mypageService.getUser(num);
        if (user != null) {
            result.put("userInfo", user);
        } else {
            result.put("userInfo", "사용자를 찾을 수 없습니다.");
            result.put("hotelReservations", 
            "이메일 정보가 없어 호텔 예약 정보를 불러올 수 없습니다.");
        }
        result.put("recentBackPacks", mypageService.findRecentBackPack(num));
        result.put("recentDiaries", mypageService.getRecentDiaries(num));
        result.put("recentTourContents", mypageService.getRecentTourContents(num));
        result.put("recentHotelContents", mypageService.getRecentHotelContents(num));

        // 사용자의 최신 5개 질문 (챗봇과의 대화)
        result.put("recentUserQuestionsFromBot", mypageService.getRecentUserQuestionsFromLogs(num, true));

        // 사용자의 최신 5개 질문 (관리자와의 대화)
        result.put("recentUserQuestionsFromAdmin", mypageService.getRecentUserQuestionsFromLogs(num, false));

        //사용자 버스 예매 내용
        // result.put("recentBusList" , mypageService.getBusList(num));

        return ResponseEntity.ok(result);
    }

    @PutMapping("/update/{num}")
    public ResponseEntity<?> updateUserInfo(@PathVariable("num") Integer num,
            @RequestBody MemberVO updatedUser) {
        try {
            mypageService.updateUserInfo(
                    num,
                    updatedUser.getName(),
                    updatedUser.getPhone(),
                    updatedUser.getEmail(),
                    updatedUser.getIntro());
            return ResponseEntity.ok("회원정보 수정 성공");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

}