package kr.co.noorigun.vo;

import java.time.LocalDateTime;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Alias("rental")
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class EquipmentRentalVO {
    private int rentalId; // 이 필드는 DB에서 자동 생성되므로 생성자에 포함되지 않음
    private int userId;
    private int itemId;
    private LocalDateTime rdate; // 대여 날짜 (기본값으로 현재 시간 설정)

    // rentalId는 DB에서 자동으로 처리되므로 이 생성자에서는 제외
public EquipmentRentalVO(int userId, int itemId, LocalDateTime rdate) {
    this.userId = userId;
    this.itemId = itemId;
    this.rdate = rdate;
    }

}
