package kr.co.ict.back.filterdemo;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/filterDemo")
public class DefaultController {
    
    @GetMapping("/main")
    public String defaultTest() {
        return "여기는 Default FilterDemo의 메인 요청입니다.";
    }
}
