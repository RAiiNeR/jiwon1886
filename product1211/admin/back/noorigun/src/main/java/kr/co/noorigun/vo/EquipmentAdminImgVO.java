package kr.co.noorigun.vo;

import org.apache.ibatis.type.Alias;

import lombok.Getter;
import lombok.Setter;

@Alias("eimgvo")
@Getter
@Setter
public class EquipmentAdminImgVO {
    private int eimgnum;
    private String imgname;
}