package kr.co.noorigun.chat;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {
    @Autowired
    private ChatLogRepository chatLogRepository;
    @Autowired
    private ChatService chatService;

    private static final String LOG_PATH = "noorigun/chat/log";

    public ChatController(){
        try {
            Files.createDirectories(Paths.get(LOG_PATH).toAbsolutePath().normalize());
        } catch (Exception e) {
            // TODO: handle exception
        }
    }

    @MessageMapping("/chat")
    @SendTo("/topic/messages")
    public ChatVO handleChatMessage(ChatVO message) throws IOException {
        System.out.println("Received message: " + message.getId() + ": " + message.getValue()+":"+message.getState());

        
        // 프로퍼티즈에서 읽어와가지고 사용하기 
        String reply = "";
        if(message.getState() == 0){
             reply =  message.getId()+"님 어서오세요";
        }else{
            reply = chatService.reply(message.getValue());
        }

        saveMessageToFile(message, false); // 사용자 메시지를 파일에 저장

        //서버응답 로그 저장
        ChatLog chatLog = new ChatLog();
        chatLog.setUserId(message.getId());
        chatLog.setMessage(message.getValue());
        chatLog.setResponse(reply);
        chatLog.setTimestamp(new Date());
        chatLogRepository.save(chatLog);

        //로그 저장
        ChatVO response = new ChatVO();
        response.setId(message.getId());
        response.setValue(reply);
        response.setState(1);
        saveMessageToFile(response, true);
        response.setId("");
        return response;        
    }

    private void saveMessageToFile(ChatVO message, boolean isServerResponse) throws IOException {
        // 오늘 날짜 기반으로 파일 이름 생성
        String today = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
        final String logPath = LOG_PATH + "/Log_" + message.getId() + today + ".txt";
        System.out.println("Saving log to: " + logPath);
        // 메시지 유형 구분: 사용자 또는 서버
        String messageType = isServerResponse ? "[SERVER]" : "[USER]";

        // 파일에 저장할 메시지 포맷
        String logMessage = String.format("%s : %s\n", messageType, message.getValue());
        Files.write(Paths.get(logPath).toAbsolutePath().normalize(), logMessage.getBytes("UTF-8"), StandardOpenOption.CREATE, StandardOpenOption.APPEND);
    }
}
