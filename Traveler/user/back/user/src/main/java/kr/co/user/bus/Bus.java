package kr.co.user.bus;

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
//2025-02-26수정 최의진 ////
@Data
@Setter
@Getter
@Entity
@Table(name="bus")
@SequenceGenerator(name = "bus_seq_gen", sequenceName = "bus_seq", initialValue = 1, allocationSize = 1)
public class Bus {

    @Id //프라이머리 key
    @GeneratedValue(strategy = GenerationType.SEQUENCE,generator ="bus_seq_gen")
    private Long num;
 
    
    @Temporal(TemporalType.TIMESTAMP)
    @Column(columnDefinition = "TIMESTAMP")
    private Date schedule;

    private String departure;
    private String destination;

    @Column(name = "departureoftime", columnDefinition = "CHAR(30)")
    private String departureoftime;

    @Column(name = "destinationoftime", columnDefinition = "CHAR(30)")
    private String destinationoftime;

    @Column(name = "sitnum", columnDefinition = "CHAR(2)")
    private String sitnum;
   
    @Column(name = "membernum" )
    private Long membernum;

}
