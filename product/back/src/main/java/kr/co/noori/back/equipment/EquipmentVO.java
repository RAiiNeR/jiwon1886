package kr.co.noori.back.equipment;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EquipmentVO {
    private Long num;
    private String rname; //장비이름
    private String state; //장비상태(재고있음/없음)
    private int cnt;
}