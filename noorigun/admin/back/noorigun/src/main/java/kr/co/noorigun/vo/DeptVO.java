package kr.co.noorigun.vo;

import org.apache.ibatis.type.Alias;

import lombok.Data;

@Data
@Alias("deptvo")
public class DeptVO {
    private Long deptno;  // 부서 번호
    private String dname; // 부서 이름
}
