package kr.co.admin.manager;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.SequenceGenerator;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
@Entity
@SequenceGenerator(name = "loginlog_seq_gen", sequenceName = "loginlog_seq", allocationSize = 1, initialValue = 1)
public class Loginlog {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "loginlog_seq_gen")
    private Long num;

    @ManyToOne
    @JoinColumn(name = "MANAGERNUM")
    @JsonBackReference
    private Manager manager;

    @Column(name = "LDATE", columnDefinition = "date default sysdate", nullable = false)
    private Date ldate;

    @Column(name = "ACCESSIP", length = 32, nullable = false)
    private String accessip;

    @Column(name = "ABNORMAL", length = 1)
    private Long abnormal;
}
