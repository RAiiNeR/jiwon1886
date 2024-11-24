package kr.co.noori.back.chat;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ChatHistoryController {
    private static final String Log_path = 
    "D:\\ICTStudy\\springboot\\react\\chatbot\\back\\src\\main\\java\\kr\\co\\noori\\back\\chat\\chat.txt";

    @GetMapping("/api/chat/history")
    public List<String> getChatHistory() {
        try {
            return Files.lines(Paths.get(Log_path)).collect(Collectors.toList());
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }
}
