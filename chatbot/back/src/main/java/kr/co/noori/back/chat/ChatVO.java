package kr.co.noori.back.chat;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChatVO {
    private String id;
    private int state;
    private String value;
}
