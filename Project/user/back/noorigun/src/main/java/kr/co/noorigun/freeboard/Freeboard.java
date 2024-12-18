package kr.co.noorigun.freeboard;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
@Entity
@SequenceGenerator(name = "freeboard_seq_gen", sequenceName = "freeboard_seq", initialValue = 1, allocationSize = 1)
public class Freeboard {
    @Id // primary key
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "freeboard_seq_gen")
    private Long num; 
    private String title;
    private String writer;
    // content 최대 글자수 제한
    @Column(length = 7000)
    private String content;

    // 이미지 저장필드
    @ElementCollection
    @CollectionTable(name = "fb_img", joinColumns = @JoinColumn(name = "fbnum"))
    @Column(name = "imgname") // 이미지 이름
    private List<String> imgNames = new ArrayList<>();

    @Column(columnDefinition = "number DEFAULT 0")
    private Long hit; // 조회수 기본값 0

    @Temporal(TemporalType.TIMESTAMP)
    @Column(columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")// 기본으로 현재 시간 설정
    private Date fdate;

    // 댓글 목록 (1:N 관계)
    @OneToMany(orphanRemoval = true) // Freeboard 삭제시 연관된 댓글도 함께 삭제
    @JoinColumn(name = "fbnum")
    @JsonIgnore // JSON 응답에서 댓글 목록을 숨김 (무한 루프 방지 및 데이터 최소화)
    private List<Fcomm> fcommlist;

};
