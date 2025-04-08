package kr.co.noorigun.program;import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class MailService {
    private final JavaMailSender javaMailSender;

    public void sendMail(String to, String subject, String text) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);  // 수신자 이메일
            message.setFrom("rtyu0728@naver.com");  // 발신자 이메일
            message.setSubject(subject);  // 이메일 제목
            message.setText(text);  // 이메일 내용

            javaMailSender.send(message);  // 메일 발송
            System.out.println("메일이 성공적으로 전송되었습니다.");
        } catch (MailException e) {
            e.printStackTrace();
            System.out.println("메일 전송에 실패했습니다.");
        }
    }
}
