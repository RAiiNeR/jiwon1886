package kr.co.admin.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class DefaultController {
    // 배포시에 해당 경로들에서 index.html로 이동 되도록
    @RequestMapping(value = {"/","/travelerAdmin/**"})
    public String index(){
        System.out.println("Index가 호춤이 됨!");
        return "forward:/index.html";
    }

}