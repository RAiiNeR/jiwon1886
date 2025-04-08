package kr.co.user.hotel.entity;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// 2025-02-15 황보도연 추가 
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "HOTEL")
public class Hotel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "NUM")
    private Long num;

    @Column(name = "NAME", length = 150, nullable = false)
    private String name;

    @Column(name = "RATING", nullable = false)
    private Integer rating = 0;

    @Lob
    @Column(name = "CONTENT", nullable = false)
    private String content;

    @Column(name = "LOCATION", length = 150, nullable = false)
    private String location;

    @Column(name = "THUMBNAIL", length = 200)
    private String thumbnail;

    @Column(name = "HIT", nullable = false)
    private Integer hit = 0;

    @Temporal(TemporalType.DATE)
    @Column(name = "HDATE", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private Date hdate;

    // 이미지 저장필드
    @ElementCollection
    @CollectionTable(name = "HOTELIMAGE", joinColumns = @JoinColumn(name = "HOTELNUM"))
    @Column(name = "IMGNAME") // 이미지 이름
    private List<String> imgNames = new ArrayList<>();

    @Column(name = "MEMBERNUM", length = 10)
    private Long membernum;
}