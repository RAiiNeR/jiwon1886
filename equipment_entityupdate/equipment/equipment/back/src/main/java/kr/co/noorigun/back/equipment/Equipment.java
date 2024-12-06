package kr.co.noorigun.back.equipment;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "equipment")
@SequenceGenerator(name = "equipment_seq_gen", sequenceName = "equipment_seq", initialValue = 1, allocationSize = 1)
public class Equipment {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "equipment_seq_gen")
    private Long num;

    @Column(nullable = false)
    private String rname;

    @Column(nullable = false)
    private String state;
    
    private int cnt;
}
