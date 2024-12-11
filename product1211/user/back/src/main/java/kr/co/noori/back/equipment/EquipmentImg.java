package kr.co.noori.back.equipment;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "equipment_img")
@SequenceGenerator(name = "equipment_img_seq_gen", sequenceName = "equipment_img_SEQ", initialValue = 1, allocationSize = 1)
public class EquipmentImg {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "equipment_img_seq_gen")
    @Column(name = "eimgnum")
    private Long eimgnum;  // 이미지 고유 ID

    @Column(name = "imgname", nullable = false)
    private String imgname;  // 이미지 이름
}
