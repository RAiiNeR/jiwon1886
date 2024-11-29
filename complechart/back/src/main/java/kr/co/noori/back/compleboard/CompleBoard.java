package kr.co.noori.back.compleboard;

import java.util.Date;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
@Entity
@Table(name = "compleboard")
@SequenceGenerator(name = "compleboard_seq_gen", sequenceName = "compleboard_seq",
    initialValue = 1, allocationSize = 1)
public class CompleBoard {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "compleboard_seq_gen")
    private Long num;
    private String title;
    private String content;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private Date cdate;
    private String state;
    @Column(name = "private", columnDefinition = "NUMBER(1) DEFAULT 1")
    private Long pri; //column명 name을 private로 
    
    @Column(columnDefinition = "number default 0")
    private Long hit;
    private Long pwd;

    private Long deptno;
}