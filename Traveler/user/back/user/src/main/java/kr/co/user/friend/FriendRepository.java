package kr.co.user.friend;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;
import kr.co.user.member.MemberVO;

public interface FriendRepository extends JpaRepository<Friend, Long> {
    @Query(value = "SELECT * FROM FRIEND WHERE Touserid =:userNum AND Arewefriend = 1", nativeQuery = true)
    List<Friend> findFriendsByUserNum(@Param("userNum") Long userNum);

    // 이메일로 사용자 이메일 목록 조회
    @Query(value = "SELECT m.email FROM MEMBER m WHERE LOWER(m.email) LIKE LOWER(CONCAT('%',:email,'%'))", nativeQuery = true)
    List<String> findUserByEmailLike(@Param("email") String email);

    // 친구요청 보내기
    @Modifying
    @Transactional
    @Query(value = "INSERT INTO FRIEND (Arewefriend, Touserid, Fdate) "+
                    "VALUES (0, (SELECT num FROM MEMBER WHERE email =:email), SYSDATE)", nativeQuery = true)
    void sendFriendRequestByEmail(@Param("email") String email);

    // 중복된 친구요청 방지 체크용 메서드
    boolean existsByTouseridAndFromuserid(MemberVO touserid, MemberVO fromuserid);

    // 받은 친구 요청 조회 (Arewefriend가 false인 것만 조회)
    @Query(value = "SELECT * FROM FRIEND WHERE Touserid = :userNum AND Arewefriend = :areWeFriend", nativeQuery = true)
    List<Friend> findFriendsByUserNumAndStatus(@Param("userNum") Long userNum, @Param("areWeFriend") int areWeFriend);

}
