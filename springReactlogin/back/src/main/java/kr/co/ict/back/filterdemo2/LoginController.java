package kr.co.ict.back.filterdemo2;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import jakarta.servlet.http.HttpSession;

//@Controller
//@RequestMapping("/filterdemo2")
public class LoginController {
    
    @GetMapping("/login")
    public String loginForm() {
        return "loginPage";
    }

    // 로그인 처리를 위해 HttpSession으로 인증처리
    @PostMapping("/login")
    public String login(@RequestParam("username") String username,
        @RequestParam("password") String password, HttpSession session, RedirectAttributes redirectAttributes) {
            // 지금은 연습이니 가짜 더미데이터
            if ("test".equals(username) && "11".equals(password)) {
                //인증 처리를 하는 부분
                session.setAttribute("authUser", username);
            } else {
                // 인증 실패했을때
                redirectAttributes.addFlashAttribute("error","정확한 인증이 아님!");
            }
            return "redirect:/admin/manage"; //인증 이후 리다이렉트 경로를 admin으로 하겠다
    }

    @RequestMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate();
        return "redirect:/filterdemo2/login"; //로그아웃 했을때 해당 경로로 이동
    }
}
