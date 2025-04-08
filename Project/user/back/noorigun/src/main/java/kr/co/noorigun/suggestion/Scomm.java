package kr.co.noorigun.suggestion;

import java.util.Date;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
@Entity
@SequenceGenerator(name = "scomm_seq_gen", sequenceName = "scomm_seq", initialValue = 1, allocationSize = 1)
public class Scomm {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "scomm_seq_gen")
    private Long num;
    private String writer;
    @Column(name="comments")
    private String comments;
    @Temporal(TemporalType.TIMESTAMP)
    @Column(columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private Date scdate;

    private Long sbnum;
}
