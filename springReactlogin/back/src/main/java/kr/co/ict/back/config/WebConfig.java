package kr.co.ict.back.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer{
    
    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController("/").setViewName("forward:index.html");
        registry.addViewController("/{path:[^\\.]*}").setViewName("forward:/");
        // => /경로, /경로/하위경로와 같은 형식의 모든 경로를 index.html로 포워딩
        registry.addViewController("/{path1:[^\\.]*}/{path2:[^\\.]*}").setViewName("forward:/index.html");
    }

   //home/ubuntu/back/uploads/ 를 리소스로 추가한다.
   @Override
   public void addResourceHandlers(ResourceHandlerRegistry registry){
    System.out.println("==========================>Adding resource handler for /uploads/**");
      registry.addResourceHandler("/uploads/**")
      //.addResourceLocations("file:/home/ubuntu/back/uploads/");
      //.addResourceLocations("file:/usr/local/tomcat/webapps/back/uploads/");  // 배포시
      .addResourceLocations("file:uploads/"); // 연습시 
   }


}