package kr.co.user.chat;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import kr.co.user.member.MemberVO;

public interface ChatRepository extends JpaRepository<MemberVO, Long> {
    @Query("SELECT m.chatlog FROM MemberVO m where m.username = :username")
    List<Chat> getChatLogs(@Param("username") String username);

    Optional<MemberVO> findByUsername(String userName);
}
