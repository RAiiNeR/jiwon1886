package kr.co.admin.email;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {
    @Autowired
    private JavaMailSender mailSender;

    public void sendBlacklistWarningEmail(String recipientEmail, String reportedPost, String reportReason)
            throws MessagingException {
        if (recipientEmail == null || recipientEmail.isEmpty()) {
            throw new MessagingException("수신자 이메일이 비어 있습니다.");
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            // 인증된 이메일 주소를 보내는 이메일로 설정
            helper.setFrom("rtyu0728@naver.com"); // 반드시 네이버에서 인증된 이메일 사용!

            helper.setTo(recipientEmail);
            helper.setSubject("⚠ 블랙리스트 경고 메일");
            helper.setText(
                    "<h3>경고 안내</h3>" +
                            "<p>신고된 게시물: " + reportedPost + "</p>" +
                            "<p>신고 사유: " + reportReason + "</p>" +
                            "<p>운영진의 검토 후 적절한 조치가 취해질 예정입니다.</p>",
                    true);

            mailSender.send(message);
        } catch (MessagingException e) {
            e.printStackTrace();
            throw new MessagingException("❌ 메일 전송 실패: " + e.getMessage());
        }
    }
}
