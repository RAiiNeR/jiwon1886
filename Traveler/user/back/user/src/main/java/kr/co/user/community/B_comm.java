package kr.co.user.community;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import kr.co.user.member.MemberVO;
import lombok.Data;

@Data
@Entity
@Table(name = "BCOMM") // 데이터베이스 테이블 이름 설정
@SequenceGenerator(name = "bcomm_seq", sequenceName = "bcomm_seq", initialValue = 1, allocationSize = 1)
public class B_comm {
    @Id // PK
    @GeneratedValue(generator = "bcomm_seq", strategy = GenerationType.SEQUENCE)
    private Long num; // 댓글 번호

    @ManyToOne(fetch = FetchType.EAGER) // 회원 엔티티와 다대일 관계
    @JoinColumn(name = "MEMBERNUM", nullable = false) // MEMBERNUM 컬럼을 외래 키로 설정
    private MemberVO member; // 댓글 작성자 정보

    @ManyToOne(fetch = FetchType.EAGER) // 배낭(게시글)과 다대일 관계 설정
    @JoinColumn(name = "BACKPACKNUM") // BACKPACKNUM 컬럼을 외래 키로 설정
    private Back_Pack backpack; // 해당 댓글이 속한 게시글 정보

    @ManyToOne(fetch = FetchType.LAZY) // 부모 댓글과 다대일 관계 (대댓글을 위해 사용)
    @JoinColumn(name = "PARENTNUM", nullable = true)  // PARENTNUM 컬럼을 외래 키로 설정 (부모 댓글이 없을 수도 있음)
    private B_comm parent; // 부모 댓글 (대댓글일 경우 값을 가짐)

    //대댓글 리스트 설정 (부모 댓글 삭제 시 대댓글도 삭제됨)
    @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<B_comm> replies = new ArrayList<>(); // 대댓글 목록

    @Column(name = "CONTENT", nullable = false)
    private String content; // 댓글 내용

    @Column(name = "BDATE", nullable = false, updatable = false)
    private LocalDateTime bdate = LocalDateTime.now(); // 댓글 작성 시간 (현재 시간 자동 설정)
}