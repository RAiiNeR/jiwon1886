package kr.co.noorigun.suggestion;

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
@Setter
@Getter
@Entity
@SequenceGenerator(name = "suggestion_seq_gen", sequenceName = "suggestion_seq", initialValue = 1, allocationSize = 1)
public class Suggestion {
    @Id // 프라이머리 key
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "suggestion_seq_gen") // 시퀀스 값
    private Long num;

    private String title;
    private String writer;

    // content 글자수 제한
    @Column(length = 7000)
    private String content;
    // 이미지 저장필드
    @ElementCollection
    @CollectionTable(name = "sb_img", joinColumns = @JoinColumn(name = "sbnum"))
    @Column(name = "imgname")
    private List<String> imgNames = new ArrayList<>();

    private String state;

    @Column(columnDefinition = "number default 0")
    private Long hit;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private Date sdate;// 작성일시

    @OneToMany(orphanRemoval = true)
    @JoinColumn(name = "sbnum")
    @JsonIgnore
    private List<Scomm> scommlist;// 댓글리스트

    private Long mnum;

};
