package kr.co.user.tour;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Table(name = "TOUR")
@Getter
@Setter
@NoArgsConstructor
@SequenceGenerator(
    name = "tour_seq_generator",
    sequenceName = "tour_seq", // Oracle에서 사용할 시퀀스명
    allocationSize = 1 // 1씩 증가
)
public class Tour {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "tour_seq_generator")
    @Column(name = "NUM")
    private Long num;  // 기본키 (시퀀스 적용됨)

    @Column(name = "NAME", length = 150, nullable = false)
    private String name;

    @Column(name = "RATING")
    private Double rating;

    @Column(name = "CONTENT", length = 1000)
    private String content;

    @Column(name = "DAYS")
    private Integer days;

    @Column(name = "LOCATION", length = 150)
    private String location;

    @Column(name = "THUMBNAIL", length = 200)
    private String thumbnail;

    @Column(name = "HIT")
    private Integer hit;

    @Column(name = "THEME", length = 100)
    private String theme;

    @Column(name = "VIDEOLINK", length = 200)
    private String videoLink;

    @Column(name = "TDATE")
    @Temporal(TemporalType.DATE)
    private Date tDate;

    @JsonManagedReference
    @OneToMany(mappedBy = "tour", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TourImage> images;

    @JsonManagedReference
    @OneToMany(mappedBy = "tour", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TourSchedule> schedules;

    @JsonManagedReference
    @OneToMany(mappedBy = "tour", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TourRecommendedLog> recommendedLogs;

    @JsonManagedReference
    @OneToMany(mappedBy = "tour", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Review> reviews;

    public void increaseHit(){
        if (this.hit == null){
            this.hit = 0;
        }
        this.hit += 1;
    }
}
