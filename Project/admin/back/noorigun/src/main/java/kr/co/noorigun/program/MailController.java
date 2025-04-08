package kr.co.noorigun.program;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.co.noorigun.vo.MailDto;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/program")
public class MailController {
    private final MailService mailService;

    @PostMapping("/sendmail")
    public String sendMail(@RequestBody MailDto mailDto) {
        mailService.sendMail(mailDto.getReceiver(), mailDto.getTitle(), mailDto.getText());
        return "메일이 성공적으로 전송되었습니다.";
    }
}
