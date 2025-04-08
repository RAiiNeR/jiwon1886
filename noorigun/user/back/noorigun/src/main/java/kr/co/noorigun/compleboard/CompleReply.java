package kr.co.noorigun.compleboard;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.Data;
/*
 * compleboard 게시글에 대한 댓글 엔티티 클래스
 * 각 댓글은 특정 게시글 cbnum에 연결되며, 부서 정보와 작성 내용을 포함
*/
@Data
@Entity
@Table(name = "comple_reply")
public class CompleReply {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "comple_reply_seq")
    @SequenceGenerator(name = "comple_reply_seq", sequenceName = "comple_reply_seq",allocationSize = 1)
    @Column(name = "reply_id")
    private Long reply_id;

    // cbnum은 compleboard 테이블의 num 필드와 연관
    @Column(name = "cbnum",nullable = false)
    private Long cbnum;

    // 답글 내용(CLOB 데이터 타입으로 큰 텍스트 저장 가능)
    @Column(name = "content",columnDefinition = "CLOB",nullable = false)
    private String content;

    // 부서 번호(댓글을 작성한 부서)
    @Column(name = "deptno",nullable = false)
    private Long deptno;

    // 답글 작성 시간
    @Column(name = "reply_date",nullable = false,insertable = false,updatable = false,columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime reply_date;
    
}
