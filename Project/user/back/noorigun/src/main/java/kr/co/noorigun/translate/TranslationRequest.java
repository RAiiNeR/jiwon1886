package kr.co.noorigun.translate;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class TranslationRequest {
    private List<String> text; //텍스트를 번역하기 위한 것
    private String target_lang; //목표언어로 번역할 언어 지정
}