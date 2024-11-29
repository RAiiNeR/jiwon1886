package kr.co.ict.back.filterdemo2;

import java.io.IOException;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;

// filter마다 특정 역할 부여하기
// 아래처럼 필터체인으로 묶어서 사용하겠다
// request --> FilterChain<MyFirstFilter => MySecondFilter => MyThirdFilter> --Servlet(SpringController[SpringContainer])
public class MyFirstFilter implements Filter{

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        String requestURI = httpRequest.getRequestURI();
        String clientIP = request.getRemoteAddr();
        System.out.println("***********************************1번째 필터");
        System.out.println("요청 아이피 : " + clientIP + " for URI: " +requestURI);
        chain.doFilter(request, response);
    }
    
}
