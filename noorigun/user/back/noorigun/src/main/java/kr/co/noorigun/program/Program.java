package kr.co.noorigun.program;

import java.util.Date;
import java.util.List;

import jakarta.persistence.Column;
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
import lombok.Getter;
import lombok.Setter;

@Data
@Setter
@Getter
@Entity
@Table(name = "program")
@SequenceGenerator(name = "program_seq_gen", sequenceName = "program_seq", initialValue = 1, allocationSize = 1)
public class Program {

  @Id
  @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "program_seq_gen")
  private Long num;

  @Column(length = 50)
  private String title;

  @Column(name = "age", columnDefinition = "NUMBER(1) DEFAULT 1")
  private Long age;

  private String content;

  @Column(length = 100)
  private String place;
  @Column(length = 100)
  private String category;
  @Column(length = 50)
  private String teacher;

  private Long student;
  private Long education;
  // 사진 파일 리스트 받기위한 작업
  private String img;

  // @ElementCollection
  // @CollectionTable(name = "registry", joinColumns = @JoinColumn(name =
  // "classnum"))
  @OneToMany
  @JoinColumn(name = "classnum")
  private List<Registry> registry;

  @Temporal(TemporalType.TIMESTAMP)
  @Column(columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
  private Date startperiod;

  @Temporal(TemporalType.TIMESTAMP)
  @Column(columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
  private Date endperiod;

  @Temporal(TemporalType.TIMESTAMP)
  @Column(columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
  private Date startdeadline;

  @Temporal(TemporalType.TIMESTAMP)
  @Column(columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
  private Date enddeadline;

  @Column(length = 30)
  private String starttime;
  @Column(length = 30)
  private String endtime;

  @Column(columnDefinition = "number default 0")
  private Long hit;
  private String pdate;
  // 지도 추가하기-2024-12-13
  // private String placeaddr; // 홍보장소 주소
  private String placename; // 장소 이름
  private Double latitude; // 위도
  private Double longitude; // 경도

}
