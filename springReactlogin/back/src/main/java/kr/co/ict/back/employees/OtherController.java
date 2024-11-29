package kr.co.ict.back.employees;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

//RestController : 커스텀 뷰를 사용한 json
//@Controller //:view가 필요함
//@RequestMapping("/api/other")
public class OtherController {
    // @GetMapping("/test")
    // public String getMethodName() {
    //     return "여기는 인증이 필요합니다. 인증 하셨군요!";
    // }

    // @GetMapping("/test")
    // public String getMethodName(Model m) {
    //     //서블릿 컨테스트 : 서블릿 전체에서 쓸 수 있는 객체
    //     //시큐리티 컨테스트 : 시큐리티 전역에서 쓸 수 있다는 객체
    //     Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    //     String currentUserName = authentication.getName();
    //     System.out.println("시큐리티에서 로그인한 세션의 사용자 이름 : " + currentUserName);
    //     m.addAttribute("username", currentUserName);
    //     return "other";
    // }

    @GetMapping("/test")
    public String getMethodName(Model model) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = null;
        String role = null;

        if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            username = userDetails.getUsername();
            role = userDetails.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .findFirst().orElse(null);
        }
        model.addAttribute("username", username);
        model.addAttribute("role", role);
        return "other";
    }

}
