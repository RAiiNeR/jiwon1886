package kr.co.noorigun.vo;

import java.util.List;

import org.apache.ibatis.type.Alias;

import lombok.Getter;
import lombok.Setter;

@Alias("svo")
@Getter
@Setter
public class SuggestionVO {
private int num;
private String title;
private String writer;
private int type;
private String content;
private int hit;
private String sdate;
private String state;
private List<String> imgNames;
}
