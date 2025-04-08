package kr.co.noorigun.program;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
@SequenceGenerator(name = "registry_seq_gen",sequenceName = "registry_seq",initialValue = 1)
public class Registry {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "registry_seq_gen")
    private Long num;
    
 @Column(name = "classnum")
    private Long classnum;
    
    @Column(name = "membernum" )
    private Long membernum;
    


}
