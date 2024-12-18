package kr.co.noorigun.member;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class MailCheckController {
	@Autowired
    private MailCheckService emailSenderService;
	 // 이메일 중복 확인 및 인증번호 발송
    @PostMapping("/emailCheck")
    public int sendEmail(@RequestBody EmailCheckDTO email) {
        System.out.println("요청 처리됨"+email.getEmail());
        // 이메일 중복 확인
        int checkEmail = emailSenderService.duplicateEmail(email.getEmail());
        if (checkEmail == 0) {
        	// 중복된 이메일이 없으면 인증번호 발송
            emailSenderService.sendEmail(email.getEmail());
            return 0; // 성공으로 처리
        }else {
            return 1; // 중복된 이메일이 존재
        }
    }
    //api/auth/emailCheck/certification
    // 이메일 인증번호 확인
    @PostMapping("/emailCheck/certification")
    public boolean verifyCertificationNumber(@RequestBody EmailCheckDTO dto) {
        System.out.println(dto.getEmail()+":"+dto.getCode());
        // 인증번호 검증 결과 반환
        return emailSenderService.isVerify(dto.getEmail(), dto.getCode());
    }
};
