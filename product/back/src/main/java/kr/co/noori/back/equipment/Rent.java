package kr.co.noori.back.equipment;

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
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Entity
@Data
@Setter
@Getter
@Table(name = "rent")
@SequenceGenerator(name = "rent_seq_gen", sequenceName = "rent_seq", initialValue = 1, allocationSize = 1)
public class Rent {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "rent_seq_gen")
    private Long rental_id;

 
    @Temporal(TemporalType.DATE)
    @Column(name = "rent_date")
    private Date rentDate; //빌린 날짜

    @ManyToOne
    @JoinColumn(name = "ename", referencedColumnName = "num")
    private Equipment equipment; //장비이름

    @ManyToOne
    @JoinColumn(name = "m_uid", referencedColumnName = "num")
    private Member member; //빌린사람

    @Column(name = "cnt")
    private int cnt; //빌린갯수
}