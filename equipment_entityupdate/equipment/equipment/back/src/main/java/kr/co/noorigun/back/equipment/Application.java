package kr.co.noorigun.back.equipment;

import java.util.Date;

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
@Table(name = "application")
@SequenceGenerator(name = "application_seq_gen", sequenceName = "reservation_seq", initialValue = 1, allocationSize = 1)
public class Application {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "application_seq_gen")
    private Long num;
    
    @ManyToOne
    @JoinColumn(name = "a_uid", referencedColumnName = "num")
    private Member member;
    
    @Temporal(TemporalType.DATE)
    private Date rdate;
    private int cnt;

    @ManyToOne
    @JoinColumn(name = "a_code", referencedColumnName = "num")
    private Equipment equipment;
}
