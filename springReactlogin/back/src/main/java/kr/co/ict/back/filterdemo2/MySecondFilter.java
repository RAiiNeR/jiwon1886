package kr.co.ict.back.filterdemo2;

import java.io.IOException;
import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletResponse;

public class MySecondFilter implements Filter{
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        HttpServletResponse httpResponse = (HttpServletResponse) response;
        System.out.println("***********************************2번째 필터");
        System.out.println("응답 : "+httpResponse.getCharacterEncoding());
        chain.doFilter(request, httpResponse);
    }
}
