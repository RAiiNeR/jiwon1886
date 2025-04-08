package kr.co.noorigun.banner;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Setter
@Getter
@Entity
@SequenceGenerator(name = "banner_seq_gen", sequenceName = "banner_seq", initialValue = 1, allocationSize = 1)
public class Banner {
    @Id // PK
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "banner_seq_gen")
    private Long num;

    private String imgname; // 배너 이미지 파일명 
}
