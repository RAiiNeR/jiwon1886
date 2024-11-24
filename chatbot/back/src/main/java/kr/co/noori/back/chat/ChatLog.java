package kr.co.noori.back.chat;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Data
@Table(name = "chatlog")
@SequenceGenerator(name = "chat_seq_gen", sequenceName = "chat_seq", initialValue = 1, allocationSize = 1)
public class ChatLog {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "chat_seq_gen")
    private Long id;
    private String userId;
    private String message;
    private String response;
    private String timestamp;
}
