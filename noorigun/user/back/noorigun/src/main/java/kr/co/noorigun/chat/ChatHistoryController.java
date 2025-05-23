package kr.co.noorigun.chat;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ChatHistoryController {
    private static final String LOG_PATH = "noorigun/chat";

    public ChatHistoryController(){
        try {
            Files.createDirectories(Paths.get(LOG_PATH).toAbsolutePath().normalize());
        } catch (Exception e) {
            // TODO: handle exception
        }
    }

    @GetMapping("/api/chat/history")
    public List<String> getChatHistory() {
        try {
            return Files.lines(Paths.get(LOG_PATH + "/chat.txt").toAbsolutePath().normalize()).collect(Collectors.toList());
        } catch (IOException e) {
            e.printStackTrace();
            return List.of();
        }
    }
}
