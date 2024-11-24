package kr.co.noori.back.chat;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/chat")
public class ChatHistoryController {
    private final ChatLogRepository chatLogRepository;

    public ChatHistoryController(ChatLogRepository chatLogRepository) {
        this.chatLogRepository = chatLogRepository;
    }

    @GetMapping("/history")
    public List<ChatLog> getChatHistory() {
        return chatLogRepository.findAll(); // 모든 로그 반환
    }
}
