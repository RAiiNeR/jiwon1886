package kr.co.admin.tour;

import jakarta.persistence.*;
import kr.co.admin.member.Member;
import kr.co.admin.member.MemberVO;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Table(name = "TOURRECOMMENDEDLOG")
@Getter
@Setter
@NoArgsConstructor
public class TourRecommendedLog {

    @SequenceGenerator(name = "tour_recommended_log_seq_generator", sequenceName = "tour_recommended_log_seq", // 새로운
                                                                                                               // 시퀀스 이름
            allocationSize = 1)
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "tour_recommended_log_seq_generator")
    @Column(name = "NUM")
    private Long num;

    @ManyToOne
    @JsonBackReference
    @JoinColumn(name = "TOURNUM", nullable = false)
    private Tour tour;

    @ManyToOne
    @JsonBackReference
    @JoinColumn(name = "MEMBERNUM", nullable = false)
    private MemberVO member;

    @Column(name = "THEME", length = 100)
    private String theme;

    @Column(name = "FEEDBACK")
    private Integer feedback;

    @Column(name = "REPLY", length = 300)
    private String reply;

    @Column(name = "RDATE")
    @Temporal(TemporalType.DATE)
    private Date rDate;
}
