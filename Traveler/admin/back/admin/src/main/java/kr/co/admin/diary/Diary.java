package kr.co.admin.diary;

import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.SequenceGenerator;
import kr.co.admin.member.MemberVO;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;


@Data
@Setter
@Getter
@Entity(name = "diary")
// @Table
@SequenceGenerator(name = "diary_seq_gen", sequenceName = "diary_seq", initialValue = 1, allocationSize = 1)
public class Diary {
    @Id
    @GeneratedValue(generator = "diary_seq_gen", strategy = GenerationType.SEQUENCE)
    private Long num;

    @Column(name = "TITLE", columnDefinition = "varchar2(150)")
    private String title;

    @Column(name = "THUMBNAIL", columnDefinition = "varchar2(200)")
    private String thumbnail;

    @Column(name = "ISSHARE", columnDefinition = "number(1) ")
    private Integer isshare;

    @Column(name = "HIT", columnDefinition = "number(7)")
    private Integer hit;

    @Column(name = "HEART", columnDefinition = "number(7)")
    private Integer heart;

    @Column(name = "DDATE", columnDefinition = "date default sysdate")
    private Date ddate;

    @OneToMany(mappedBy = "diary", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference //부모(Diary)에서 자식(Diarypage) 관리
    private List<DiaryPage> diaryPage;

    // @ManyToOne
    // @JoinColumn(name = "membernum", referencedColumnName = "num")
    // @JsonBackReference //자식(Diary)에서 부모(MemberVO) 참조 제거 (무한 루프 방지)
    // private MemberVO member;

    @Column(name = "membernum", columnDefinition = "number(5)")
    private Long membernum;

    @Column(name = "diaryemotion", columnDefinition = "varchar2(10)")
    private String diaryemotion;

}
