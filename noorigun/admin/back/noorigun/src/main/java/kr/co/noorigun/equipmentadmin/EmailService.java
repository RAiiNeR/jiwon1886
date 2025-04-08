package kr.co.noorigun.equipmentadmin;

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

    // @Autowired
    // private MemberDao memberDao;

    // @Autowired
    // private RentDao rentDao;

    // @Autowired
    // private ReserveDao reserveDao;

    // 이메일 발송 메서드
    public void sendEmail(String reuid, String itemid, String email) {
        try {
            System.out.println(itemid);
            String subject = "주문하신 물품 [" + itemid + "]이 들어왔습니다. 신청하시겠습니까?";
            String body = "<p>주문하신 " + itemid + "이(가) 입고되었습니다.</p>";
            // + "<p><a href='http://localhost:81/back/api/rent/reserve" + itemid + "'>신청하러
            // 가기</a></p>";

            // MimeMessage 객체 생성
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper messageHelper = new MimeMessageHelper(mimeMessage, true);

            // 보내는 사람 이메일을 member.getEmail()로 설정
            messageHelper.setFrom("rtyu0728@naver.com"); // 여기에서 member의 이메일을 사용
            messageHelper.setTo(email);
            messageHelper.setSubject(subject);
            messageHelper.setText(body, true); // HTML 형식으로 이메일 내용 설정
            // 이메일 발송
            mailSender.send(mimeMessage);

            // 로그 추가
            System.out.println("이메일 발송 완료: " + email);
        } catch (MessagingException e) {
            System.err.println("이메일 발송 실패: " + e.getMessage());

        }
    }
}