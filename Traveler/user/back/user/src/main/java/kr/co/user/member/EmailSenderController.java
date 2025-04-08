package kr.co.user.member;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
//2025-02-15 전준영 생성
@RestController
@RequestMapping("/api/member")
public class EmailSenderController {
	@Autowired
    private EmailSenderService emailSenderService;
	 // 이메일 중복 확인
    @PostMapping("/emailCheck")
    public int sendEmail(@RequestBody EmailSenderDTO email) {
      
        System.out.println("요청 처리됨"+email.getEmail());
        int checkEmail = emailSenderService.duplicateEmail(email.getEmail());
        System.out.println("중복된 이메일인지 아닌지:"+checkEmail);
        if (checkEmail == 0) {
        	//중복된 이메일이 없을 때 메일을 전송한다.
            emailSenderService.sendEmail(email.getEmail());
            return 0;
        }else {
            return 1;
        }
    }
    //api/auth/emailCheck/certification
    // 이메일 인증번호 확인
    @PostMapping("/emailCheck/certification")
    public boolean verifyCertificationNumber(@RequestBody EmailSenderDTO dto) {
        System.out.println("===========================================");
        System.out.println(dto.getEmail()+":"+dto.getCode());
        System.out.println("===========================================");
        return emailSenderService.isVerify(dto.getEmail(), dto.getCode());
    }
}