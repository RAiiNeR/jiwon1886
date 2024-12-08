package kr.co.noori.back.equipment;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "reservations")
@SequenceGenerator (name = "reservations_seq_gen", sequenceName = "reservations_seq", initialValue = 1, allocationSize = 1)
public class Reservation { //예약서 신청
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "reservations_seq_gen")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "member_id") // 예약된 회원을 나타내는 컬럼
    private Member member;

    @ManyToOne
    @JoinColumn(name = "equipment_id") // 예약된 물품을 나타내는 컬럼
    private Equipment equipment;

    private int quantity;

    @Enumerated(EnumType.STRING)
    private ReservationStatus status;

    @Column(name = "r_time")
    private LocalDateTime reservedTime;
}
