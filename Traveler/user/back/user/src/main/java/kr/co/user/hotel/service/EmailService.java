package kr.co.user.hotel.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendReservationEmail(String to, String subject, String text) {
        try {
            jakarta.mail.internet.MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            // 보내는 사람을 지정합니다.
            helper.setFrom("rtyu0728@naver.com"); // 여기서 이메일 주소를 설정합니다.
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(text, true); // HTML 형식 가능

            mailSender.send(message);
            System.out.println("✅ 이메일 전송 완료!");
        } catch (jakarta.mail.MessagingException e) {
            e.printStackTrace();
            System.out.println("❌ 이메일 전송 실패!");
        }
    }
}
