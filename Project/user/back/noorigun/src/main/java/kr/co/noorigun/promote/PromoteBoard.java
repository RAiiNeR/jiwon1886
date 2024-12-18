package kr.co.noorigun.promote;

import java.util.Date;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
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
@Table(name = "promoteboard")
@SequenceGenerator(name = "promoteboard_seq_gen", sequenceName = "promoteboard_seq", initialValue = 1, allocationSize = 1)
public class PromoteBoard {
    @Id // primary key
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "promoteboard_seq_gen")
    private Long num;

    private String title;
    private String writer;
    private String content;

    // PB_IMG테이블 만들기(이미지 파일명 지정: pbnum으로 PromoteBoard와 연결 )
    @ElementCollection
    @CollectionTable(name = "PB_IMG", joinColumns = @JoinColumn(name = "pbnum"))
    @Column(name = "imgname")
    private List<String> imgNames = new ArrayList<>();

    @Column(columnDefinition = "number default 0")
    private Long hit;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP") // 현재 시간으로 기본값 지정
    private Date pdate;

    private String placeaddr; // 홍보장소 주소
    private String placename; // 홍보장소 이름
    private Double latitude; // 홍도장소 위도
    private Double longitude; // 홍보장소 경도
}
