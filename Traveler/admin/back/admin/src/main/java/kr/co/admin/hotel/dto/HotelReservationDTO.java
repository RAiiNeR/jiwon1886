package kr.co.admin.hotel.dto;

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
public class HotelReservationDTO {

    private Long num;
    private Long membernum;
    private String membername;
    private String memberemail;
    private String hotelname;
    private String roomname;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date checkindate;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date checkoutdate;

    private BigDecimal totalprice;
    private int numguests;
}
