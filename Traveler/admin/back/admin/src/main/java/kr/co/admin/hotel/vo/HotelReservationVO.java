package kr.co.admin.hotel.vo;

import java.math.BigDecimal;
import java.util.Date;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class HotelReservationVO {
    private Long num;
    private Long membernum;
    private Long roomnum;
    private int numguests;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date checkindate;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date checkoutdate;
    private String memberemail;
    private BigDecimal totalprice;
    private String status;

}