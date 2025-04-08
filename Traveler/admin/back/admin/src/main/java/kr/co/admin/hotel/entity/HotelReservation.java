package kr.co.admin.hotel.entity;

import lombok.*;
import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonFormat;
import java.math.BigDecimal;
import java.util.Date;

@Entity
@Table(name = "HOTELRESERVATION")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class HotelReservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long num;

    @Column(name = "MEMBERNUM", nullable = false)
    private Long membernum;

    @ManyToOne
    @JoinColumn(name = "ROOMNUM")
    private Room roomnum;

    @Column(name = "NUMGUESTS", nullable = false)
    private int numguests;

    @Temporal(TemporalType.DATE)
    @Column(name = "CHECKINDATE", nullable = false)
    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date checkindate;

    @Temporal(TemporalType.DATE)
    @Column(name = "CHECKOUTDATE", nullable = false)
    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date checkoutdate;

    @Column(name = "MEMBEREMAIL", length = 50)
    private String memberemail;

    @Column(name = "TOTALPRICE", precision = 7)
    private BigDecimal totalprice;

    @Column(name = "STATUS", length = 1)
    private String status;
}
