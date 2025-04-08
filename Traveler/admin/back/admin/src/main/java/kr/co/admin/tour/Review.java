package kr.co.admin.tour;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.Date;

import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Table(name = "TOUR_REVIEW") // 테이블명 변경
@Getter
@Setter
@NoArgsConstructor
@SequenceGenerator(
    name = "tour_review_seq_generator",
    sequenceName = "tour_review_seq", // Oracle 시퀀스명
    allocationSize = 1
)
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "tour_review_seq_generator")
    @Column(name = "REVIEW_ID")
    private Long id;  // 기본키

    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "TOUR_NUM", referencedColumnName = "NUM", nullable = false) // ✅ 수정된 부분
    private Tour tour;  // 투어와 연결

    @Column(name = "USER_NAME", length = 100)
    private String userName; // 리뷰 작성자 이름

    @Column(name = "RATING", nullable = false)
    private Double rating; // 별점

    @Column(name = "CONTENT", columnDefinition = "CLOB", nullable = false)
    private String content; // 리뷰 내용

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "CREATED_AT", nullable = false, updatable = false)
    private Date createdAt; // 리뷰 작성 날짜

    @PrePersist
    protected void onCreate() {
        this.createdAt = new Date();
    }
}
