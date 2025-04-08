package kr.co.user.chat;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.co.user.member.Member;
import kr.co.user.member.MemberVO;

@Service
public class ChatService {
    @Autowired
    private ChatRepository chatRepository;

    public List<Chat> getChatlogs(String username) {
        return chatRepository.getChatLogs(username);
    }

    @Transactional
    public void addLogToUserName(String userName, String fileName, boolean isBot) {
        // 기존 Member를 조회
        MemberVO member = chatRepository.findByUsername(userName)
            .orElseThrow(() -> new RuntimeException("Member not found"));

        Chat chat = new Chat();
        chat.setLogfile(fileName);
        chat.setType((isBot ? 1L : 0L));
        chat.setCdate(new Date());

        List<Chat> chatlogs = member.getChatlog();
        boolean ch = true;
        for(Chat c : chatlogs){
            if(chat.getLogfile().equals(c.getLogfile())){
                ch = false;
            }
        }
        if (ch) {
            chatlogs.add(chat);
        }

        // Member 저장 (chatlog 테이블에 데이터 추가)
        chatRepository.save(member);
    }
}
