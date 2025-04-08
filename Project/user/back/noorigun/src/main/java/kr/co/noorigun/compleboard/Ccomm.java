package kr.co.noorigun.compleboard;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.Data;


@Data
@Entity
@SequenceGenerator(name = "ccomm_seq_gen", sequenceName = "ccomm_seq", initialValue = 1, allocationSize = 1)
public class Ccomm {
    @Id // primary key
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "ccomm_seq_gen") // 자동 증가 식별자
    private Long num;

    private String writer;

    private String comments;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP") // 현재 시간 기본값
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul") // JSON 직렬화시 필요하면 사용
    private Date ccdate;

    private Long cbnum; // 댓글에 포함된 게시글 번호

}
