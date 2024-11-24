package kr.co.noori.back.chat;

import java.util.Map;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final ChatLogRepository chatLogRepository;

    public ChatController(ChatLogRepository chatLogRepository) {
        this.chatLogRepository = chatLogRepository;
    }

    // POST 요청을 처리하는 메서드
    @PostMapping("/sendMessage")
    public ChatVO handlePostChatMessage(@RequestBody ChatVO message) {
        System.out.println("받은 메시지: " + message.getId() + " : 내용 " + message.getValue());

        // 응답 생성
        String response = "죄송해요, 이해하지 못했어요."; // 기본 응답
        Map<String, String> chatMap = Files_Collection.loadChatMapping();
        System.out.println("챗봇 맵: " + chatMap);  // 추가된 로그
        if (chatMap.containsKey(message.getValue())) {
            response = chatMap.get(message.getValue());
        }

        // 데이터베이스에 로그 저장
        ChatLog chatLog = new ChatLog();
        chatLog.setUserId(message.getId());
        chatLog.setMessage(message.getValue());
        chatLog.setResponse(response);
        chatLog.setTimestamp(java.time.LocalDateTime.now().toString());
        chatLogRepository.save(chatLog);

        // 응답 생성
        ChatVO responseMessage = new ChatVO();
        responseMessage.setId("ChatBot");
        responseMessage.setState(1);
        responseMessage.setValue(response);

        return responseMessage;
    }
}
