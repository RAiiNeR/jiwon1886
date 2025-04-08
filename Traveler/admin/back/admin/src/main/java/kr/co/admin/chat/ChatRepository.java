package kr.co.admin.chat;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import kr.co.admin.member.MemberVO;
import jakarta.persistence.Tuple;

public interface ChatRepository extends JpaRepository<MemberVO, Long> {
    @Query("SELECT m.username as username, m.name as name, m.chatlog as chatlog FROM MemberVO m")
    List<Tuple> getChatLogs();

    Optional<MemberVO> findByUsername(String userName);
}
