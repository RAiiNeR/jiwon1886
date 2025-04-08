package kr.co.user.friend;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import kr.co.user.member.MemberRepository;
import kr.co.user.member.MemberVO;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FriendService {
    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private FriendRepository friendRepository;

    // 친구목록 조회
    public List<Friend> getFriendsList(Long userNum) {
        return friendRepository.findFriendsByUserNum(userNum);
    }

    // 친구검색
    public List<String> searchUserByEmail(String email) {
        return friendRepository.findUserByEmailLike(email);
    }

    @Transactional
    public FriendVO sendFriendRequest(Long fromUserNum, String toUserEmail) {
        // 1. 친구 요청을 보내는 사용자를 데이터베이스에서 조회
        MemberVO fromUser = memberRepository.findById(fromUserNum)
        .orElseThrow(() -> new RuntimeException("친구 요청을 보내는 사용자가 없습니다."));

        // 2. 친구요청을 받는 사용자를 이메일로 조회
        MemberVO toUser = memberRepository.findByEmail(toUserEmail)
        .orElseThrow(() -> new RuntimeException("친구 요청을 받을 사용자가 없습니다."));

        // 3. 중복요청 방지 : 이미 친구요청을 보냈거나 친구인지 확인
        boolean exists = friendRepository.existsByTouseridAndFromuserid(toUser, fromUser);
        if (exists) {
            throw new RuntimeException("이미 친구 요청을 보냈거나 친구입니다.");
        }

        // 4. 친구 요청 생성
        Friend friendRequest = Friend.builder()
                .Arewefriend(false) // 친구요청 상태
                .touserid(toUser) // 요청받는 사람
                .fromuserid(fromUser) // 요청 보내는 사람
                .Fate(new Date()) // 요청 날짜
                .build();
        // 5. 요청을 데이터베이스에 저장
        Friend savedFriend = friendRepository.save(friendRequest);

        // 6. FriendVO 객체로 변환해서 반환
        return FriendVO.builder()
                .friendId(savedFriend.getFriendid())
                .areWeFriend(savedFriend.isArewefriend())
                .toUserId(toUser.getNum())
                .toUserName(toUser.getName())
                .requestDate(savedFriend.getFate())
                .build();
    }

    // 친구 요청 목록 조회 (Arewefriend가 false인 경우만 조회)
    public List<FriendVO> getReceivedFriendRequests(Long userNum) {
        List<Friend> requests = friendRepository.findFriendsByUserNumAndStatus(userNum, 0);

        // 타입 명시 (명확하게 FriendVO라고 명시!)
        return requests.stream()
                .map((Friend request) -> FriendVO.builder()
                        .friendId(request.getFriendid())
                        .toUserId(request.getTouserid().getNum())
                        .toUserName(request.getFromuserid().getName())
                        .fromUserId(userNum)
                        .requestDate(request.getFate())
                        .areWeFriend(false)
                        .build())
                .collect(Collectors.toList());
    }

    // 친구 요청 수락 처리 (Arewefriend를 true로 변경)
    @Transactional
    public void acceptFriendRequest(Long friendRequestId) {
        // 기존 친구 요청 레코드 조회 및 수락 처리
        Friend friendRequest = friendRepository.findById(friendRequestId)
                .orElseThrow(() -> new RuntimeException("해당 친구 요청이 존재하지 않습니다."));
        friendRequest.setArewefriend(true);
        friendRepository.save(friendRequest);

        // 반대 방향의 친구 관계 레코드가 이미 존재하는지 확인 (선택 사항)
        boolean reciprocalExists = friendRepository.existsByTouseridAndFromuserid(
                friendRequest.getFromuserid(), friendRequest.getTouserid());
        if (!reciprocalExists) {
            // 반대 방향의 친구 관계 레코드 생성
            Friend reciprocalFriend = Friend.builder()
                    .Arewefriend(true)
                    .touserid(friendRequest.getFromuserid()) // 원래 요청을 보낸 사람을 대상으로 함
                    .fromuserid(friendRequest.getTouserid()) // 원래 요청을 받은 사람을 출발점으로 함
                    .Fate(new Date())
                    .build();
            friendRepository.save(reciprocalFriend);
        }
    }

    // 친구 요청 거절 처리 (레코드를 삭제)
    @Transactional
    public void rejectFriendRequest(Long friendRequestId) {
        if (!friendRepository.existsById(friendRequestId)) {
            throw new RuntimeException("해당 친구 요청이 존재하지 않습니다.");
        }
        friendRepository.deleteById(friendRequestId);
    }

}
