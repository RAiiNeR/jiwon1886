package kr.co.ictstudy.back.memo;

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
@Setter
@Getter
@Entity
@Table(name = "memo")
@SequenceGenerator(name = "memo_seq_gen", sequenceName = "memo_seq", initialValue = 1, allocationSize = 1)
public class Memo {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "memo_seq_gen")
    private Long id;
    private String title;
    
    @Column(length = 50, nullable = false)
    private String writer;
    private String memocont;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private Date mdate;
}
