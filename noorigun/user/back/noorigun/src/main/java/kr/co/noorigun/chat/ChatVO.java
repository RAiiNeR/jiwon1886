package kr.co.noorigun.chat;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChatVO {
    private String id; // 사용자 
	private int state; // 상태
	private String value; // 소켓에 주고 받을 내용
}
