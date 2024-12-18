package kr.co.noorigun.chat;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "response")
public class Response {
    @Id
    private Long id;
    private String key;
    private String response;
}
