package kr.co.admin.email;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import jakarta.mail.MessagingException;

@RestController
@RequestMapping("/api")
public class EmailController {
    @Autowired
    private EmailService emailService;

    @PostMapping("/sendEmail")
    public ResponseEntity<String> sendEmail(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String reportedPost = request.get("reportedPost");
            String reportReason = request.get("reportReason");
    
            if (email == null || email.isEmpty()) {
                return ResponseEntity.status(400).body("이메일 주소가 없습니다.");
            }
    
            emailService.sendBlacklistWarningEmail(email, reportedPost, reportReason);
            return ResponseEntity.ok("메일 발송 완료");
    
        } catch (MessagingException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("메일 발송 실패: " + e.getMessage());
        }
    }
}
