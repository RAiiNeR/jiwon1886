package kr.co.ict.back.filterdemo2;

import java.io.IOException;
import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

public class MyThirdFilter implements Filter{

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        //요청과 응답 및 세션을 모두 받아온다.
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;
        HttpSession session = httpRequest.getSession();
        String requestURI = httpRequest.getRequestURI();
        System.out.println("requestURI: "+requestURI);

        //requestURI.endsWith("입니다.")  ---> 해당 단어로 끝나는 문장일 경우 true
        //requestURI.startsWith("테스형") ---> 해당 단어로 시작되는 문장일 경우 true
        if (requestURI.startsWith("/back/admin")) {
            String loginUser = (String) session.getAttribute("authUser");
            if (loginUser == null) {
                //인증이 안되었다면 /filterdemo2/login으로 보낸다
                httpResponse.sendRedirect(httpRequest.getContextPath()+ "/filterdemo2/login");
                return;
            } else {
                //인증이 된 상태
                System.out.println("접속자의 아이피: " + httpRequest.getRemoteAddr());
            }
        }//여기까지가 전처리
        chain.doFilter(httpRequest, httpResponse);
    }

    // @Override
    // public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
    //     HttpServletRequest httpRequest = (HttpServletRequest) request;
    //     String requestURI = httpRequest.getRequestURI();
    //     System.out.println("requestURI : " +requestURI);
        
    //     if ("/back/helloAA".equals(requestURI)) {
    //         HttpServletResponse httpResponse = (HttpServletResponse) response;
    //         httpResponse.setContentType("text/html;charset=utf-8");
    //         httpResponse.getWriter().write("해당 경로로 접속이 불가능합니다.");
    //         return; //아무것도 반환을 안하기 때문에 응답을 종료한다는 뜻
    //     } else {
    //         System.out.println("***********************************3번째 필터");
    //         System.out.println("3번째 필터 처리 동작됨");
    //     }
    //     chain.doFilter(httpRequest, response);
    // }
}
//필터를 각 목적에 맞게 정의하기
//aop - before, after, arround, 