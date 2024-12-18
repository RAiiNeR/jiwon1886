package kr.co.noorigun.faq;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
@Entity
@SequenceGenerator(name="faq_seq_gen", sequenceName = "faq_seq", initialValue = 1, allocationSize = 1)
public class Faq {
    @Id // PK
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "faq_seq_gen")
    private Long num;
    private String category; // FAQ의 카테고
    private String title;
    private String answer; // 답변
    
};
