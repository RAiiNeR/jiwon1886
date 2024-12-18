package kr.co.noori.back.equipment;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Column;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Setter
@Getter
@Table(name = "reserve")
@SequenceGenerator (name = "reserve_seq_gen", sequenceName = "reserve_seq", initialValue = 1, allocationSize = 1)
public class Reserve {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "reserve_seq_gen")
    private Long num;  // 예약 고유 ID (primary key)

    // Member와의 관계
    @ManyToOne
    @JoinColumn(name = "reuid")
    private Member member;  // Member의 id와 연관된 필드

    @ManyToOne
    @JoinColumn(name = "rname")
    private Member rname;

    // Equipment와의 관계
    @ManyToOne
    @JoinColumn(name = "requip")
    private Equipment equipment; // Equipment의 rname과 연관된 필드

    @Column(name = "recnt")
    private int recnt;  // 예약 수량

    @Column(name = "remail")
    private String remail;  // 예약자 이메일

    @Enumerated(EnumType.STRING)
    private ReservationStatus status;
}
