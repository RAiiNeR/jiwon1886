package kr.co.noorigun.compleboard;

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
import jakarta.persistence.OneToMany;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.Data;

@Data
@Entity
@Table(name = "compleboard")
@SequenceGenerator(name = "compleboard_seq_gen", sequenceName = "compleboard_seq", initialValue = 1, allocationSize = 1)
public class CompleBoard {

    @Id // primary key
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "compleboard_seq_gen")
    private Long num;
    private String title;
    // content 글자수 제한
    @Column(length = 7000)
    private String content;
    private String writer;

    // 이미지 저장필드
    @ElementCollection
    @CollectionTable(name = "cb_img", joinColumns = @JoinColumn(name = "cbnum"))
    @Column(name = "imgname")
    private List<String> imgNames = new ArrayList<>();

    @Temporal(TemporalType.TIMESTAMP)
    @Column(columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private Date cdate;
    private String state;

    @Column(name = "private", columnDefinition = "NUMBER(1) DEFAULT 1")
    private Long pri;

    @Column(columnDefinition = "number default 0")
    private Long hit;    

    private Long pwd;

    private Long deptno;
    private Long mnum;

    // 댓글 목록 (1:N 관계)
    @OneToMany(orphanRemoval = true) // Compleboard 삭제시 연관된 댓글도 함께 삭제
    @JoinColumn(name = "cbnum")
    private List<Ccomm> ccommlist;
}
