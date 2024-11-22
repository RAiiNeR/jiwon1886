package kr.co.noori.back.chat;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {
    private static final String Log_path =
    "D:\\ICTStudy\\springboot\\react\\chatbot\\back\\src\\main\\java\\kr\\co\\noori\\back\\chat\\chat.txt";

    @MessageMapping("/kakao")
    @SendTo("/topic/messages")
    public ChatVO handleChatMessage(ChatVO message) throws IOException {
        System.out.println("받은 메세지 : " + message.getId() + " : 내용 " + message.getValue());
        saveMessageFile(message);
        return message;
    }

    private void saveMessageFile(ChatVO message) throws IOException {
		String logMessage = null;
		if (message.getState() == 0) {
			logMessage="입장.";
		} else {
			logMessage="메세지 :";
		}
		logMessage = logMessage+message.getId()+" : "+message.getValue();
		Files.write(Paths.get(Log_path), logMessage.getBytes("UTF-8"), StandardOpenOption.CREATE, StandardOpenOption.APPEND);
	}
}
