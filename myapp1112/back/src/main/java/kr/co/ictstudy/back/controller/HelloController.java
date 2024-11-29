package kr.co.ictstudy.back.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {
    
    @GetMapping("/hello")
    public String helloMessage(){
        return "안녕하세요";
    }
}
