package kr.co.noorigun.suggestion;


import java.util.Date;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class ScommVO {
    private Long num;
    private String writer;
    private String comments;
    private Date scdate;
    private Long sbnum;
}

