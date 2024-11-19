package kr.co.back.board;

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
@Table(name = "board")
@SequenceGenerator(name = "board_seq_gen", sequenceName = "board_seq", initialValue = 1, allocationSize = 1)
public class Board {
    @Id
    //시퀸스를 num에 mapping해준것
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "board_seq_gen")
    private Long  num;

    private String title;
    private String writer;
    private String content;

    //추가
    //이미지 테이블을 자동으로 만들어주는 역할
    //테이블명 : board_images | board_num
    @ElementCollection
    @CollectionTable(name = "board_images", joinColumns = @JoinColumn(name="board_num"))
    @Column(name = "image_Name")
    private List<String> imgNames = new ArrayList<>();

    @Column(columnDefinition="number default 0")
    private Long hit;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private Date bdate;
}
