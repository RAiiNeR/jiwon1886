package kr.co.noorigun.translate;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Translation {
    private String detected_source_language; //원본텍스트에서 감지된 언어
    private String text; //번역된 텍스트
}