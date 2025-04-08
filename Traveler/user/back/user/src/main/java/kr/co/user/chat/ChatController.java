package kr.co.user.chat;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
@RequestMapping("/chat")
public class ChatController {

    private Path uploadPath = Paths.get("./files/logs").toAbsolutePath().normalize();

    public ChatController() {
        try {
            Files.createDirectories(uploadPath);
        } catch (Exception e) {
            throw new RuntimeException("Failed to create upload directory", e);
        }
    }

    @Autowired
    private ChatService chatService;

    @GetMapping("/{username}")
    public List<Chat> getChatLogByMembernum(@PathVariable("username") String username) {
        return chatService.getChatlogs(username);
    }

    @PostMapping("/{username}")
    public String addChating(@PathVariable("username") String username, @RequestParam("chat") String chat,
            @RequestParam(name = "isBot", defaultValue = "true") boolean isBot) {
        String logFile = "Log_" + (isBot ? "Bot_" : "") + String.valueOf(LocalDate.now()).replaceAll("-", "") + "_"
                + username + ".log";
        StringBuilder saveMsg = new StringBuilder();
        saveMsg.append(username).append("||user||").append(chat);

        try {
            // 파일 객체 생성
            File file = new File(uploadPath + "/" + logFile);
            FileOutputStream fos;
            // 파일이 존재하지 않으면 새로 생성
            if (!file.exists()) {
                file.createNewFile();
                fos = new FileOutputStream(file);
            } else {
                fos = new FileOutputStream(file, true);
                saveMsg.insert(0, "\n");
            }
            OutputStreamWriter osw = new OutputStreamWriter(fos, "UTF-8"); // UTF-8 인코딩 사용
            BufferedWriter bw = new BufferedWriter(osw);
            bw.write(saveMsg.toString()); // 내용 쓰기
            bw.close(); // BufferedWriter 닫기
            System.out.println("파일이 성공적으로 생성되었습니다.");
            chatService.addLogToUserName(username, logFile, isBot);
            if (isBot) {
                fos = new FileOutputStream(file, true);
                osw = new OutputStreamWriter(fos, "UTF-8"); // UTF-8 인코딩 사용
                bw = new BufferedWriter(osw);
                String answer = chatBot(chat).replaceAll("\n", "");
                saveMsg = new StringBuilder();
                saveMsg.append("\nBot||admin||").append(answer);
                bw.write(saveMsg.toString()); // 내용 쓰기            
                bw.close(); // BufferedWriter 닫기

                return answer;
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        return chat;
    }

    public String chatBot(String chat) {
        RestTemplate restTemplate = new RestTemplate();// HTTP요청을 보내기 위해 사용되는 Spring의 HTTP클라이언트

        Map<String, String> request = new HashMap<>();
        request.put("message", chat);

        HttpHeaders headers = new HttpHeaders(); // HTTP요청 헤더를 생성하는 객체
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));// 서버에서 JSON응답을 기대
        headers.setContentType(MediaType.APPLICATION_JSON);// 요청데이터 형식을 JSON으로 설정

        try {
            HttpEntity<String> entity = new HttpEntity<>(new ObjectMapper().writeValueAsString(request), headers);
            ResponseEntity<Map> response = restTemplate.exchange(
                    "http://localhost:9000/chatbot/ask", HttpMethod.POST,
                    entity, Map.class);
            return (String) response.getBody().get("answer");
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }

        return "연결 실패";
    }

}
