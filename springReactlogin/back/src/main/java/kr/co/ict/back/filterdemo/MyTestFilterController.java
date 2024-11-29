package kr.co.ict.back.filterdemo;

import java.io.IOException;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;

// Filter를 구현한 클래스
// 요청이 올때 Servlet 앞에서 선/후 처리할때 사용되는 개념이다. 이것을 ServletFilter라고 한다.
public class MyTestFilterController implements Filter{

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain filterChain) throws IOException, ServletException {
        System.out.println("Start !"); //전처리 하고
        filterChain.doFilter(request, response); //요청된 필터 찍고
        System.out.println("End !"); //후처리 하고
        System.out.println("========================================="); //끝
    }
    
}
