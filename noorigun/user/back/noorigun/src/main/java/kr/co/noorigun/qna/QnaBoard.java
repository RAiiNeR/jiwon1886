package kr.co.noorigun.qna;
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
@Table(name = "QNABOARD") // 데이터베이스의 QNABOARD 테이블과 매핑
@SequenceGenerator(name = "QNABOARD_SEQ_GEN", sequenceName = "QNABOARD_SEQ", initialValue = 1, allocationSize = 1)
public class QnaBoard {
    @Id // PK
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "QNABOARD_SEQ_GEN")
    private Long num;
    
    private String title;
    private String writer;
    @Column(length = 7000)
    private String content;

    @Column(columnDefinition = "number default 0")
    private Long hit;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private Date qdate;

    @Column(name = "PARENTNUM")
    private Long parentnum; // 답변형태 게시판 번호

    private Long mnum; // 회원 번호(게시글 작성자)

}
