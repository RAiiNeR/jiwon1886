package kr.co.user.tour;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "TOURSCHEDULE")
@Getter
@Setter
@NoArgsConstructor
public class TourSchedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // 자동 증가 ID
    @Column(name = "NUM")
    private Long num;

    @Column(name = "PLACE", length = 150, nullable = false)
    private String place;

    @Lob
    @Column(name = "CONTENT", nullable = false)
    private String content;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "TOURNUM", nullable = false)
    @JsonBackReference // 🔹 순환 참조 방지
    private Tour tour;

    @Column(name = "DAY", nullable = false)
    private Integer day;
}
