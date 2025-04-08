package kr.co.user.member;


import java.util.Random;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

//2025-02-15 전준영 생성
@Service
public class EmailSenderService {
	//스프링에서 메일을 전송하기 위한 객체 DI
    @Autowired
    private JavaMailSender mailSender;
    @Autowired
    private MemberRepository memberRepository;
    @Autowired
    private EmailSenderDAO certificationNumberDAO;
    //-------------------------------------------------
    private String authCode;
    
    // 이메일 중복 확인
    public int duplicateEmail(String email) {
        int checkEmail = memberRepository.existsByEmail(email);
        return checkEmail > 0 ? 1 : 0; // 1: 이메일 중복 존재, 0: 이메일 중복 없음
    }
    //4pXegF
    public void createAuthCode() {
        int length = 6;
        StringBuilder authCode = new StringBuilder();
        Random random = new Random();
        for (int i = 0; i < length; i++) {
            int type = random.nextInt(3);
            switch (type) {
                case 0:
                    authCode.append(random.nextInt(10));
                    break;
                case 1:
                    authCode.append((char) (random.nextInt(26) + 65)); //A
                    break;
                case 2:
                    authCode.append((char) (random.nextInt(26) + 97)); //a
                    break;
            }
        }
        this.authCode = authCode.toString();
    }
    
    
 // 회원가입 : 이메일 인증번호 발송
    public void sendEmail(String toEmail) {
        createAuthCode();
        MimeMessage message = mailSender.createMimeMessage();
        try {
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setFrom("rtyu0728@naver.com");
            helper.setTo(toEmail);
            helper.setSubject("ICTStudy의 X팀의 회원가입 인증번호 발송");
            String body = "<html>" +
                    "<body>" +
                    "<h1>ICTStudy의 X팀의 회원가입을 위한 인증번호</h1>" +
                    "<p>회원가입을 완료하기 위해 아래의 인증코드를 입력해주세요.</p>" +
                    "<p>인증코드: <strong>" + authCode + "</strong></p>" +
                    "</body>" +
                    "</html>";
            helper.setText(body, true);
            mailSender.send(message);
            certificationNumberDAO.saveCertificationNumber(toEmail, authCode);

        } catch (MessagingException e) {
            throw new RuntimeException(e);
        }
    }

    public boolean isVerify(String email, String authCode) {
        System.out.println(certificationNumberDAO.hasKey(email));
        System.out.println(authCode);
        System.out.println(certificationNumberDAO.getCertificationNumber(email));
        if (certificationNumberDAO.hasKey(email) && certificationNumberDAO.getCertificationNumber(email).equals(authCode)) {
            certificationNumberDAO.deleteCertificationNumber(email);
            return true;
        } else {
            return false;
        }
    }
    
}