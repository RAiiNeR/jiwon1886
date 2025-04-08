package kr.co.user.friend;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import kr.co.user.member.MemberRepository;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/travelTogether")
@RequiredArgsConstructor
public class FriendController {
    @Autowired
    private FriendService friendService;

    @Autowired
    private MemberRepository memberRepository;

    @GetMapping("/check-login/{userNum}")
    public ResponseEntity<Boolean> checkLogin(@PathVariable("userNum") Long userNum) {
        boolean exists = memberRepository.existsById(userNum);
        return ResponseEntity.ok(exists);
    }

    @GetMapping("/{userNum}")
    public ResponseEntity<List<Map<String, Object>>> getFriends(@PathVariable("userNum") Long userNum) {
        List<Friend> friends = friendService.getFriendsList(userNum);

        // 친구의 이름과 friendId만 보여줌
        List<Map<String, Object>> response = friends.stream().map(friend -> {
            Map<String, Object> map = new HashMap<>();
            map.put("friendId", friend.getFriendid());
            map.put("friendName", friend.getFromuserid().getName());
            map.put("profileImgNum", friend.getFromuserid().getNum() % 5 + 1);
            return map;
        }).collect(Collectors.toList());

        if (response.isEmpty()) {
            return ResponseEntity.ok(Collections.emptyList());
        }

        return ResponseEntity.ok(response.isEmpty() ? Collections.emptyList() : response);
    }
    // @GetMapping
    // public ResponseEntity<List<Map<String, Object>>>
    // getFriends(@RequestParam("userNum") Long userNum) {
    // List<Friend> friends = friendService.getFriendsList(userNum);

    // List<Map<String, Object>> response = friends.stream().map(friend -> {
    // Map<String, Object> map = new HashMap<>();
    // map.put("friendId", friend.getFriendid());
    // map.put("friendName", friend.getFromuserid().getName());
    // map.put("profileImgNum", friend.getFromuserid().getNum() % 5 + 1);
    // return map;
    // }).collect(Collectors.toList());

    // return ResponseEntity.ok(response.isEmpty() ? Collections.emptyList() :
    // response);
    // }

    // 이메일로 사용자 검색
    @PostMapping("/search")
    public ResponseEntity<?> searchUserByEmail(@RequestBody Map<String, Object> request) {
        try {
            String email = request.get("email").toString();

            return memberRepository.findByEmail(email)
                    .map(member -> {
                        int profileImgNum = (int) (member.getNum() % 5) + 1;
                        Map<String, Object> result = new HashMap<>();
                        result.put("num", member.getNum());
                        result.put("name", member.getName());
                        result.put("profileImgNum", profileImgNum);
                        return ResponseEntity.ok(result);
                    })
                    .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                            .body(Collections.singletonMap("error", "사용자를 찾을 수 없습니다.")));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("요청 처리 중 오류 발생");
        }
    }

    // 친구요청 보내기
    @PostMapping("/send-request")
    public ResponseEntity<?> sendFriendRequest(@RequestBody Map<String, Object> request) {
        try {
            Long fromUserNum = Long.valueOf(request.get("fromUserNum").toString()); // 친구요청 보내는 사람의 번호
            String toUserEmail = request.get("toUserEmail").toString(); // 친구요청 받는 사람의 이메일
            FriendVO friendVO = friendService.sendFriendRequest(fromUserNum, toUserEmail);
            return ResponseEntity.ok(friendVO);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("친구 요청을 보내는 중 오류가 발생했습니다.");
        }
    }

    // 친구요청 받은 목록
    @PostMapping("/requests")
    public ResponseEntity<List<Map<String, Object>>> getFriendRequests(@RequestBody Map<String, Object> request) {
        try {
            Long userNum = Long.valueOf(request.get("userNum").toString());

            List<FriendVO> requests = friendService.getReceivedFriendRequests(userNum);

            List<Map<String, Object>> response = requests.stream().map(req -> {
                Map<String, Object> map = new HashMap<>();
                map.put("friendRequestId", req.getFriendId());
                map.put("fromUserName", req.getToUserName());
                map.put("profileImgNum", (req.getFromUserId() % 5) + 1); // ✅ 요청 보낸 사용자의 프로필 이미지 번호
                return map;
            }).collect(Collectors.toList());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Collections.singletonList(Collections.singletonMap("error", "친구 요청 목록을 가져오는 중 오류가 발생했습니다.")));
        }
    }

    // 친구요청 수락
    @PostMapping("/requests/accept")
    public ResponseEntity<Map<String, Object>> acceptRequest(@RequestBody Map<String, Object> request) {
        try {
            Long friendRequestId = Long.valueOf(request.get("friendRequestId").toString()); // 요청한 사람
            Long userNum = Long.valueOf(request.get("userNum").toString()); // 요청받은 사람

            friendService.acceptFriendRequest(friendRequestId);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "친구요청을 수락하였습니다.");
            response.put("friendRequestId", friendRequestId);
            response.put("acceptedBy", userNum);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Collections.singletonMap("error", "친구 요청을 수락하는 중 오류가 발생했습니다."));
        }
    }

    // 친구요청 거절
    @PostMapping("/requests/reject")
    public ResponseEntity<Map<String, Object>> rejectRequest(@RequestBody Map<String, Object> request) {
        try {
            Long friendRequestId = Long.valueOf(request.get("friendRequestId").toString());
            Long userNum = Long.valueOf(request.get("userNum").toString()); // 요청을 거절하는 사용자

            friendService.rejectFriendRequest(friendRequestId);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "친구요청을 거절했습니다.");
            response.put("friendRequestId", friendRequestId);
            response.put("rejectedBy", userNum);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Collections.singletonMap("error", "친구 요청을 거절하는 중 오류가 발생했습니다."));
        }
    }

}
