package kr.co.noori.back.chat;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.Properties;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {
    @Autowired
    private ChatLogRepository chatLogRepository;

    private static final String LOG_PATH = "D:\\ICTStudy\\springboot\\react\\chatbot\\back\\src\\main\\java\\kr\\co\\noori\\back\\chat\\chat.txt";
    private static final String ANSWERS_PATH = "D:\\ICTStudy\\springboot\\react\\chatbot\\back\\src\\main\\java\\kr\\co\\noori\\back\\chat\\res.properties";
    // 메서드가 호출이 될 때 ans.properties 로드해서 Properties 반환 - 
    private Properties loadAnswers() throws IOException {
        Properties answers = new Properties();
        answers.load(Files.newBufferedReader(Paths.get(ANSWERS_PATH)));
        return answers;
    }
    // key값을 찾지 못하면 기본값이 문자열로 반환되는 즉 서버의 응답 메세지
    private String generateReply(String userMessage) throws IOException {
        Properties answers = loadAnswers();
        return answers.getProperty(userMessage, 
        "음, 답을 찾기 어려운 질문이네요. \n누리봇에 부족한 점이 있었다면 \n콜센터(📞02-1234-5678)로 문의해주세요.");
    }
    // 0은 입장니니까 이때는 Properties에 보내지 말고, message.getId()+"님 어서오세요";
    // 1은 Properties에 답변을 리턴한다.
    @MessageMapping("/chat")
    @SendTo("/topic/messages")
    public ChatVO handleChatMessage(ChatVO message) throws IOException {
        System.out.println("Received message: " + message.getId() + ": " + message.getValue()+":"+message.getState());

        // 프로퍼티즈에서 읽어와가지고 사용하기 
        String reply = "";
        if(message.getState() == 0){
             reply =  message.getId()+"님 어서오세요";
            System.out.println("Reply: " + reply);
        }else{
            reply = generateReply(message.getValue());
            System.out.println("Reply: " + reply);
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
        final String logPath = "D:\\ICTStudy\\springboot\\react\\chatbot\\back\\src\\main\\resources\\static\\resources\\textfile\\Log_" + message.getId() + today + ".txt";
        System.out.println("Saving log to: " + logPath);
        // 메시지 유형 구분: 사용자 또는 서버
        String messageType = isServerResponse ? "[SERVER]" : "[USER]";

        // 파일에 저장할 메시지 포맷
        String logMessage = String.format("%s : %s\n", messageType, message.getValue());
        Files.write(Paths.get(logPath), logMessage.getBytes("UTF-8"), StandardOpenOption.CREATE, StandardOpenOption.APPEND);
    }
}
