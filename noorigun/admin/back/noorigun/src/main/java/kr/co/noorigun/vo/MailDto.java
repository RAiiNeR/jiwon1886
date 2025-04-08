package kr.co.noorigun.vo;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MailDto {
    private String title;  // 제목
    private String text;   // 내용
    private String receiver;  // 수신자 이메일
}
