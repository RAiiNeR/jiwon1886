package kr.co.noorigun.equipment;

import java.sql.Date;
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
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "equipment")
@SequenceGenerator (name = "equipment_seq_gen", sequenceName = "equipment_seq", initialValue = 1, allocationSize = 1)
public class Equipment {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "equipment_seq_gen")
    private Long num;

    @Column(nullable = false)
    private String rname; //이름

    @Column(nullable = false)
    private String state; //물품상태 (재고있음/없음)
    
    private int cnt; //현재 갯수

    @Column(nullable = false)
    private int rcnt = 0; // 대여된 수량 (기본값 0)

    // 이미지 저장필드
    @ElementCollection
    @CollectionTable(name = "equipment_img", joinColumns = @JoinColumn(name = "eimgnum"))
    @Column(name = "imgname") // 이미지 이름
    private List<String> imgNames = new ArrayList<>();

    @Column(nullable = false)
    @Temporal(TemporalType.DATE)
    private Date edate;

}