package kr.co.admin.userList;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.co.admin.member.MemberVO;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserListService {
    @Autowired
    private UserListRepository userListRepository;

    // 회원목록
    public List<Object[]> findAllMemberList() {
        return userListRepository.findAllMemberList();
    }

    public List<Map<String, String>> getFriendNamesAndEmails(Integer num) {
        // Native SQL 쿼리 실행
        List<Object[]> results = userListRepository
        .findFriendNamesAndEmailsByUserNum(num);
        // 중복 제거를 위한 Set 사용
        Set<Map<String, String>> uniqueFriends = new HashSet<>();

        List<Map<String, String>> friendsList = new ArrayList<>();
        // 결과를 Map 형태로 변환
        for (Object[] row : results) {
            Map<String, String> friend = new HashMap<>();
            friend.put("name", (String) row[0]);
            friend.put("email", (String) row[1]);
            friendsList.add(friend);
            uniqueFriends.add(friend);  // 중복 데이터 자동 제거
        }
        return new ArrayList<>(uniqueFriends);
    }

    // 단일회원 삭제
    // 단일 회원 삭제 및 친구 관계 삭제
    @Transactional
    public void deleteMemberByNum(Integer num) {
        try {
            // 친구 관계 삭제
            userListRepository.deleteFriendshipsByNumList(num); // 친구 관계 먼저 삭제
            // 회원 삭제
            userListRepository.deleteMemberByNum(num); // 회원 삭제
        } catch (Exception e) {
            // 예외 처리: 에러 메시지 출력
            throw new RuntimeException("Error deleting member: " + e.getMessage());
        }
    }

    // 다중 회원 삭제 및 해당 회원과 친구인 관계도 삭제
    @Transactional
    public void deleteMembers(List<Integer> numList) {
        if (numList != null && !numList.isEmpty()) {
            // 단일 또는 다중 회원 삭제 및 친구 관계 삭제
            userListRepository.deleteFriendshipsByNumList(numList);
        }
    }

    // 페이징처리 + 회원목록
    // ✅ 페이지네이션을 적용한 회원 목록 조회
    public List<Object[]> getMemberPaging(String name, int startRow, int endRow) {
        return userListRepository.findWithPaging(name, startRow, endRow);
    }
}
