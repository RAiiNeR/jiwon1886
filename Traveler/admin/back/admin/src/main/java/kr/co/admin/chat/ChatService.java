package kr.co.admin.chat;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.co.admin.member.MemberVO;
import jakarta.persistence.Tuple;

@Service
public class ChatService {
    @Autowired
    private ChatRepository chatRepository;

    public List<Map<String, Object>> getChatlogs() {
        List<Tuple> tuples = chatRepository.getChatLogs();
        List<Map<String, Object>> result = new ArrayList<>();
        Map<String, Object> map = new HashMap<>();
        List<Chat> chats = new ArrayList<>();
        for (Tuple t : tuples) {
            if(map.get("username") == null){
                map.put("username", t.get("username"));
                map.put("name", t.get("name"));
                map.put("chatlog", chats);
                result.add(map);
            }else if(!map.get("username").equals(t.get("username"))){
                chats = new ArrayList<>();
                map.put("username", t.get("username"));
                map.put("name", t.get("name"));
                map.put("chatlog", chats);
                result.add(map);
                map = new HashMap<>();
            }
            chats.add((Chat) t.get("chatlog"));     
        }
        return result;
    }

    @Transactional
    public void addLogToUserName(String userName, String fileName) {
        // 기존 Member를 조회
        MemberVO member = chatRepository.findByUsername(userName)
                .orElseThrow(() -> new RuntimeException("Member not found"));

        Chat chat = new Chat();
        chat.setLogfile(fileName);
        chat.setType(0L);
        chat.setCdate(new Date());

        List<Chat> chatlogs = member.getChatlog();
        boolean ch = true;
        for (Chat c : chatlogs) {
            if (chat.getLogfile().equals(c.getLogfile())) {
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
