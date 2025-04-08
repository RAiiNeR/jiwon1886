package kr.co.noorigun.vo;

import java.time.LocalDateTime;

import org.apache.ibatis.type.Alias;
import lombok.Getter;
import lombok.Setter;

@Alias("rent")
@Setter
@Getter
public class RentVO {
    private int rentalid; // 이 필드는 DB에서 자동 생성되므로 생성자에 포함되지 않음
    private String userid;
    private Long itemid;
    private int rcnt;
    private LocalDateTime rdate = LocalDateTime.now(); // 대여 날짜 (기본값으로 현재 시간 설정)

    // rentalId는 DB에서 자동으로 처리되므로 이 생성자에서는 제외
    public RentVO(String userid, Long itemid) {
        this.userid = userid;
        this.itemid = itemid;
    }
}
