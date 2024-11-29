package kr.co.ictstudy.back.gallery;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;

import lombok.Setter;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Data
@Setter
@Getter
@Entity
@Table(name = "gallery")
@SequenceGenerator(name = "GALLERY_SEQ_GENERATOR", sequenceName = "GALLERY_SEQ", initialValue = 1, allocationSize = 1)
public class Gallery {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "GALLERY_SEQ_GENERATOR")
    private Long id;
    @Column(length = 50, nullable = false)
    private String writer;

    private String title;
    private String description;
    /*
     * @CollectionTable 애너테이션은 JPA에서 엔티티의 컬렉션을 별도의 테이블에 저장하도록 지정할 때 사용
     * 일대다 관계를 모델링하는 데 사용
     * - @CollectionTable을 사용하면, 주 엔티티(Gallery)와 연결된 부 엔티티(imageNames)의 데이터를 별도의
     * 테이블(gallery_images)에 저장
     * - @JoinColumn(name = "gallery_id")은 주 테이블의 기본 키를 참조하는 외래 키를 지정
     */
    @ElementCollection
    @CollectionTable(name = "gallery_images", joinColumns = @JoinColumn(name = "gallery_id"))
    @Column(name = "image_name")
    private List<String> imageNames = new ArrayList<>();

    @Temporal(TemporalType.TIMESTAMP)
    @Column(columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private Date gdate;
}
