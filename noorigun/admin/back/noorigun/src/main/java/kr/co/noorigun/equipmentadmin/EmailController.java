package kr.co.noorigun.equipmentadmin;

import java.util.Map;

import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/equipment")
public class EmailController {

    // EmailService 주입
    private final EmailService emailService;

    // 이메일 발송을 위한 POST 메서드
    @PostMapping("/sendmail") // reuid는 유저 이름, itemId는 물품 이름름
    public ResponseEntity<?> sendMail(@RequestBody Map<String, String> map) {
        try {
            // 이메일과 itemId를 사용해 이메일 발송
            emailService.sendEmail(map.get("reuid"), map.get("itemId"), map.get("email"));
            return ResponseEntity.ok("메일이 성공적으로 전송되었습니다.");
        } catch (DataAccessException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("데이터베이스 오류 발생: " + e.getMessage());
        } catch (Exception e) {
            System.out.println(e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("메일 전송 중 오류 발생: " + e.getMessage());
        }
    }
}
