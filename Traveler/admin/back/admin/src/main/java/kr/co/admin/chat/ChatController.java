package kr.co.admin.chat;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

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

    @GetMapping
    public List<Map<String, Object>> getChatLogByMembernum() {
        return chatService.getChatlogs();
    }

    @PostMapping("/{username}")
    public String addChating(@PathVariable("username") String username, @RequestParam("chat") String chat) {
        String logFile = "Log_" +String.valueOf(LocalDate.now()).replaceAll("-", "")  + "_" + username + ".log";
        String saveMsg = "관리자||admin||" + chat;

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
                saveMsg = "\n" + saveMsg;
            }
            OutputStreamWriter osw = new OutputStreamWriter(fos, "UTF-8");  // UTF-8 인코딩 사용
            BufferedWriter bw = new BufferedWriter(osw);
            bw.write(saveMsg); // 내용 쓰기
            bw.close(); // BufferedWriter 닫기
            System.out.println("파일이 성공적으로 생성되었습니다.");
            chatService.addLogToUserName(username, logFile);
        } catch (IOException e) {
            e.printStackTrace();
        }

        return chat;
    }

}
