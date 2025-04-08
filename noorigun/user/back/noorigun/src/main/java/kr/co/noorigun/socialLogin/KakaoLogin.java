package kr.co.noorigun.socialLogin;

import java.io.IOException;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/kakao-login")
public class KakaoLogin {

    @GetMapping
    public void callback(@RequestParam(value = "code") String code, HttpServletResponse response) throws IOException {
        response.sendRedirect("/noorigun/kakaologin/"+code);
        //return new ResponseEntity<>(HttpStatus.OK);
    }
}
