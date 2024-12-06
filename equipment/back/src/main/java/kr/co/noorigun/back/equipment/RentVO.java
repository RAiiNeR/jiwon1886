package kr.co.noorigun.back.equipment;

import java.util.Date;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class RentVO {
    private Long num;
    private Date rentDate;
    private Equipment equipment;
    private Member member;
    private int cnt;
}
