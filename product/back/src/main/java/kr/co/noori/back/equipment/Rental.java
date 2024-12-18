package kr.co.noori.back.equipment;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Date;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;

@Getter
@Setter
@Entity
@Table(name = "RENTAL")
@SequenceGenerator(name = "rental_seq_gen", sequenceName = "rental_seq", initialValue = 1, allocationSize = 1)
public class Rental {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "rental_seq_gen")
    private Long rentalId;

    @ManyToOne
    @JoinColumn(name = "userId")
    private Member member;

    @ManyToOne
    @JoinColumn(name = "itemId", nullable = false)
    private Equipment equipment; // 장비 (EQUIPMENT 테이블 참조)

    private int rcnt; // 

    @Column(nullable = false)
    @Temporal(TemporalType.DATE)
    private Date rdate; // 대여일
}
