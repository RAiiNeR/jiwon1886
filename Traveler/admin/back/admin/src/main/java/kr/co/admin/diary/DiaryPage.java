package kr.co.admin.diary;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Setter
@Getter
@Entity(name = "diarypage")
// @Table
@SequenceGenerator(name = "diarypage_seq_gen", sequenceName = "diarypage_seq", initialValue = 1, allocationSize = 1)
public class DiaryPage {
    @Id
    @GeneratedValue(generator = "diarypage_seq_gen", strategy = GenerationType.SEQUENCE)
    private Long num;

    @Column(name = "PAGE", columnDefinition = "number(2)")
    private Integer page;

    @Column(name = "PTITLE", columnDefinition = "varchar2(150)")
    private String ptitle;

    @Column(name = "IMGNAME", columnDefinition = "varchar2(200)")
    private String imgname;

    @Column(name = "CONTENT", columnDefinition = "varchar2(300)")
    private String content;

    @Column(name = "LOCATION", columnDefinition = "varchar2(150)")
    private String location;

    @Column(name = "HAPPY", columnDefinition = "NUMBER(5,2)")
    private Double happy;

    @Column(name = "UPSET", columnDefinition = "NUMBER(5,2)")
    private Double upset;

    @Column(name = "EMBRESSED", columnDefinition = "NUMBER(5,2)")
    private Double embressed;

    @Column(name = "SAD", columnDefinition = "NUMBER(5,2)")
    private Double sad;

    @Column(name = "NEUTRALITY", columnDefinition = "NUMBER(5,2)")
    private Double neutrality;

    @Column(name = "emotion", columnDefinition = "varchar2(10)")
    private String emotion;

    @ManyToOne
    @JoinColumn(name = "diarynum", referencedColumnName = "num")
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonBackReference // 자식(Diarypage)에서 부모(Diary) 참조 제거 (무한 루프 방지)
    private Diary diary;
}
