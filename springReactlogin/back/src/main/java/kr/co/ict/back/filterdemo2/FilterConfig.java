package kr.co.ict.back.filterdemo2;

import org.springframework.boot.web.servlet.FilterRegistrationBean;

//filter환경빈을 설정함

//@Configuration
public class FilterConfig {
    //@Bean
    public FilterRegistrationBean<MyFirstFilter> myFirstFilterRegistrationBean() {
        //필터를 등록해야 하니까 new 생성(내가 만든 필터를 등록한다)
        FilterRegistrationBean<MyFirstFilter> registrationBean = new FilterRegistrationBean<>(new MyFirstFilter());
        //요청을 필터할 수 있는 메서드를 호출
        //http://localhost:81/back/* 을 의미한다
        registrationBean.addUrlPatterns("/*");
        
        // filter의 이름을 부여해서 구별해야 한다
        registrationBean.setName("MyFirstFilter");
        registrationBean.setOrder(1); // 첫번째 필터
        return registrationBean;
    }

    //@Bean
    public FilterRegistrationBean<MySecondFilter> mySecondFilterRegistrationBean() {
        FilterRegistrationBean<MySecondFilter> registrationBean = new FilterRegistrationBean<>(new MySecondFilter());
        registrationBean.addUrlPatterns("/*");
        registrationBean.setName("MySecondFilter");
        registrationBean.setOrder(2); // 두번째 필터
        return registrationBean;
    }

    //@Bean
    public FilterRegistrationBean<MyThirdFilter> myThirdFilterRegistrationBean() {
        FilterRegistrationBean<MyThirdFilter> registrationBean = new FilterRegistrationBean<>(new MyThirdFilter());
        registrationBean.addUrlPatterns("/helloAA","/admin/*"); // 특정 경로에 대해 필터 적용
        registrationBean.setName("MyThirdFilter");
        registrationBean.setOrder(3); // 3번째 필터
        return registrationBean;
    }
}
