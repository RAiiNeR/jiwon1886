package kr.co.user.hotel.entity;

import java.math.BigDecimal;
import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// 2025-02-16 황보도연 추가
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
