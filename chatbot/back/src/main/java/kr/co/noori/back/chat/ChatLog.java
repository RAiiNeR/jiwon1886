package kr.co.noori.back.chat;

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
@Entity
@Getter
@Setter
@Table(name = "chatlog")
@SequenceGenerator(name = "chatlog_seq_gen", sequenceName = "chatlog_seq", initialValue = 1, allocationSize = 1)
public class ChatLog {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "chatlog_seq_gen")
    private Long id;
    private String userId;
    private String message;
    private String response;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private Date timestamp;
}
