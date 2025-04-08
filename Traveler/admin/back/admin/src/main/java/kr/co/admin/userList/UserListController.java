package kr.co.admin.userList;

import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/userList")
public class UserListController {
    @Autowired
    private UserListService userListService;

    // 회원목록 조회 + 페이징처리
    @GetMapping
    public ResponseEntity<List<Object[]>> getMembers(
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "startRow", required = false) Integer startRow,
            @RequestParam(value = "endRow", required = false) Integer endRow) {

        List<Object[]> result;

        if (name == null || name.isEmpty()) {
            result = userListService.findAllMemberList();
        } else {
            result = userListService.getMemberPaging(name, startRow, endRow);
        }

        if (result.isEmpty()) {
            return ResponseEntity.noContent().build(); // 204 No Content
        }

        return ResponseEntity.ok(result); // 200 OK
    }

    // 친구 목록 조회
    @GetMapping("/friends")
    public ResponseEntity<List<Map<String, String>>> getFriendNamesAndEmails(@RequestParam("num") Integer num) {
        List<Map<String, String>> friendsList = userListService.getFriendNamesAndEmails(num);

        // 친구 목록이 없으면 204 No Content 반환
        if (friendsList.isEmpty()) {
            return ResponseEntity.noContent().build(); // 204 No Content
        }

        // 친구 목록 반환
        return ResponseEntity.ok(friendsList); // 200 OK
    }

    // 단일회원 삭제
    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteMember(@RequestParam("num") Integer num) {
        try {
            userListService.deleteMemberByNum(num); // 회원 삭제
            return ResponseEntity.ok("Member deleted successfully");
        } catch (RuntimeException e) {
            // 에러 메시지를 클라이언트로 전송
            return ResponseEntity.status(500).body("Error deleting member: " + e.getMessage());
        }
    }

    // 다중 회원 삭제 (체크리스트)// 다중 회원 삭제 및 해당 회원과 친구인 관계도 삭제
    @DeleteMapping("/deleteMultiple")
    public ResponseEntity<String> deleteMultipleMembers(@RequestBody List<Integer> numList) {
        try {
            userListService.deleteMembers(numList);
            return ResponseEntity.ok("Members and their friendships deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error deleting members and their friendships");
        }
    }

}
