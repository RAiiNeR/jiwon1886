package kr.co.noori.back.equipment;

import java.sql.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "equipment")
@SequenceGenerator (name = "equipment_seq_gen", sequenceName = "equipment_seq", initialValue = 1, allocationSize = 1)
public class Equipment {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "equipment_seq_gen")
    private Long num;

    @Column(nullable = false)
    private String rname; //이름

    @Column(nullable = false)
    private String state; //물품상태 (재고있음/없음)
    
    private int cnt; //현재 갯수

    @Column(nullable = false)
    private int rcnt = 0; // 대여된 수량 (기본값 0)

    @Column(nullable = false)
    @Temporal(TemporalType.DATE)
    private Date edate;

}