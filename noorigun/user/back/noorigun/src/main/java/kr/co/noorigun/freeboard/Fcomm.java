package kr.co.noorigun.freeboard;

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

/*
 * Fcomm 클래스는 Freeboard(자유게시판)의 댓글 데이터를 저장하기 위한 엔티티
*/
@Data
@Entity
@SequenceGenerator(name = "fcomm_seq_gen", sequenceName = "fcomm_seq", initialValue = 1, allocationSize = 1)
public class Fcomm {
    @Id // primary key
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "fcomm_seq_gen")
    private Long  num;
    private String writer;
    @Column(name = "comments")
    private String comment;
    @Temporal(TemporalType.TIMESTAMP)
    @Column(columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private Date fcdate;

    private Long fbnum;
}
