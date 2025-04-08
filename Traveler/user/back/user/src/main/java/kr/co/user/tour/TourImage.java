package kr.co.user.tour;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "TOURIMAGE")
@Getter
@Setter
@NoArgsConstructor
public class TourImage {

    @SequenceGenerator(name = "tour_image_seq_generator", sequenceName = "tour_image_seq", // Oracle 시퀀스 이름
            allocationSize = 1)
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "tour_image_seq_generator")
    @Column(name = "TOURINFONUM")
    private Long tourInfoNum;

    @Column(name = "IMGNAME", length = 200)
    private String imgName;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "TOURNUM", nullable = false)
    @JsonBackReference
    private Tour tour;
}
