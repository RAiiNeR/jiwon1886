package kr.co.ict.back.filterdemo;

import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

//filter환경빈을 설정함

//@Configuration
public class FilterConfig {
    //@Bean
    public FilterRegistrationBean<MyTestFilterController> myFilterRegistrationBean() {
        //필터를 등록해야 하니까 new 생성(내가 만든 필터를 등록한다)
        FilterRegistrationBean<MyTestFilterController> registrationBean = new FilterRegistrationBean<>(new MyTestFilterController());
        //요청을 필터할 수 있는 메서드를 호출
        //http://localhost:81/back/admin/* 을 의미한다
        registrationBean.addUrlPatterns("/admin/*"); // <-----admin으로 들어오는 모든 요청. 예를들어 admin안에 있는 manage까지 호출할 수 있다
        registrationBean.setOrder(1); //filter의 우선순위를 지정한다
        return registrationBean;
    }
}
