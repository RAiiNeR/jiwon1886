package kr.co.noorigun.member;

import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;


@Service
public class MailCheckService {
	//스프링에서 메일을 전송하기 위한 객체 DI
    @Autowired
    private JavaMailSender mailSender;
    // member Repository
    @Autowired
    private MemberRepository memberRepository;
    // 인증번호 저장 및 관리용 DAO
    @Autowired
    private MailCheckDAO mailCheckDAO;
    //-------------------------------------------------
    private String authCode; // 인증번호 저장 필드
    
    // 이메일 중복 확인
    public int duplicateEmail(String email) {
        int checkEmail = memberRepository.countByEmail(email);
        return checkEmail > 0 ? 1 : 0; // 1: 이메일 중복 존재, 0: 이메일 중복 없음
    }
    //4pXegF
    // 인증번호 생성
    // 랜덤한 6자리의 숫자 및 알파벳(A-Z, a-z)을 조합한 인증번호 생성
    public void createAuthCode() {
        int length = 6;
        StringBuilder authCode = new StringBuilder();
        Random random = new Random();
        for (int i = 0; i < length; i++) {
            int type = random.nextInt(3); // 인증번호 타입 결정(숫자, 대문자, 소문자)
            switch (type) {
                case 0:
                    authCode.append(random.nextInt(10)); // 숫자 추가
                    break;
                case 1:
                    authCode.append((char) (random.nextInt(26) + 65)); // A 대문자
                    break;
                case 2:
                    authCode.append((char) (random.nextInt(26) + 97)); // a 소문자
                    break;
            }
        }
        this.authCode = authCode.toString();
    }
    
    
    // 회원가입 : 이메일 인증번호 발송
    public void sendEmail(String toEmail) {
        createAuthCode(); // 인증번호 생성
        MimeMessage message = mailSender.createMimeMessage();
        try {
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setFrom("rtyu0728@naver.com"); // 발신자 이메일 생성
            helper.setTo(toEmail); // 수신자 이메일 설정
            helper.setSubject("ICTStudy의 X팀의 회원가입 인증번호 발송");
            // 이메일 본문 설정 (HTML 형식)
            String body = "<html>" +
                    "<body>" +
                    "<h1>ICTStudy의 X팀의 회원가입을 위한 인증번호</h1>" +
                    "<p>회원가입을 완료하기 위해 아래의 인증코드를 입력해주세요.</p>" +
                    "<p>인증코드: <strong>" + authCode + "</strong></p>" +
                    "</body>" +
                    "</html>";
            helper.setText(body, true);
            mailSender.send(message); // 이메일 발송
            mailCheckDAO.saveCertificationNumber(toEmail, authCode); // 이메일과 인증번호 저장

        } catch (MessagingException e) {
            throw new RuntimeException(e);
        }
    }

    // 이메일 인증번호 검증
    public boolean isVerify(String email, String authCode) {
        System.out.println(mailCheckDAO.hasKey(email)); // 이메일 존재 여부 확인
        System.out.println(authCode); // 입력된 인증번호 출력
        System.out.println(mailCheckDAO.getCertificationNumber(email)); // 저장된 인증번호 출력
        // 이메일이 존재하고 저장된 인증번호와 일치하면 인증 성공      
        if (mailCheckDAO.hasKey(email) && mailCheckDAO.getCertificationNumber(email).equals(authCode)) {
            mailCheckDAO.deleteCertificationNumber(email); // 인증 완료 후 인증번호 삭제
            return true;
        } else {
            return false; // 인증 실패
        }
    }
    
}
