package kr.co.ict.back.filterdemo;
// filter를 적용할 클래스

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

//@RestController
//@Controller
//@RequestMapping("/admin")
public class AdminController {
    @RequestMapping(value = "/manage")
    public String manage(Model model) {
        // SecurityContextHolder --> 스프링시큐리티의 Scope저장영역
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = null;
        String role = null;

        if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
            //UserDetails란? --> 권한, 사용자 정보등을 가진 Entity의 부모 클래스
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            username = userDetails.getUsername();
            role = userDetails.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .findFirst().orElse(null);
                    System.out.println("UserDetails -> " + username + ", " + role);
        } else {
            System.out.println("Admin 인증에 문제가 발생!");
        }

        //adminPage에 forward로 전송 (requestScope)
        model.addAttribute("username", username);
        model.addAttribute("role", role);
        return "adminPage";
    }
    
    // @RequestMapping(value = "/manage")
    // public String manage() {
    //     System.out.println("Admin관련 메서드가 호출이 됨!");
    //     return "adminPage";
    // }
}