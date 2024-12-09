package kr.co.noori.back.equipment;

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

    public void sendOrderAvailableEmail(Member member, Equipment equipment) throws MessagingException {
        try {
            String to = member.getEmail();
            String subject = "주문하신 물품이 들어왔습니다. 신청하시겠습니까?";
            String body = "<p>주문하신 " + equipment.getRname() + "이(가) 입고되었습니다.</p>"
                    + "<p><a href='http://localhost:81/api/rent/renting" + equipment.getRname() + "'>신청하러 가기</a></p>";
            
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper messageHelper = new MimeMessageHelper(mimeMessage, true);
            
            messageHelper.setFrom(member.getEmail()); //여기 원래는 "rimp3719@naver.com"이었음 (고정된 이메일)
            messageHelper.setTo(to);
            messageHelper.setSubject(subject);
            messageHelper.setText(body, true);
            
            mailSender.send(mimeMessage);
            
            // 로그 추가
            System.out.println("이메일 발송 완료: " + to);
        } catch (MessagingException e) {
            System.err.println("이메일 발송 실패: " + e.getMessage());
            throw e;
        }
    }
}