package kr.co.user.community;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import kr.co.user.hotel.entity.HotelReservation;
import kr.co.user.member.MemberVO;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
@Entity // initialValue: 1부터 시작 // allocationSize: 1씩 증가
@Table(name = "BACKPACK")
@SequenceGenerator(name = "backpack_seq_gen", sequenceName = "backpack_seq", initialValue = 1, allocationSize = 1)
public class Back_Pack {
    @Id // PK
    @GeneratedValue(generator = "backpack_seq_gen", strategy = GenerationType.SEQUENCE)
    private Long num; // 게시글 고유 ID

    @ManyToOne // 다대일 관계 설정: 여러 개의 게시글이 한 명의 회원과 연결됨
    @JoinColumn(name = "MEMBERNUM", nullable = false)
    private MemberVO member; // 작성자 정보

    @ManyToOne(fetch = FetchType.LAZY) // 지연 로딩 설정
    @JoinColumn(name = "RESERVATIONNUM", referencedColumnName = "num", nullable = true)
    private HotelReservation reservation; // 예약 정보 (선택 사항)

    @Column(name = "TITLE", nullable = false)
    private String title; // 제목

    @Lob // 대용량 데이터 저장
    @Column(name = "CONTENT", columnDefinition = "clob", nullable = false)
    private String content; // 내용

    @Temporal(TemporalType.TIMESTAMP) // 날짜, 시간 같이 저장
    @Column(columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP") // 자동으로 현재 시간 입력
    private Date cdate; // 작성일

    @Column(name = "HIT", nullable = false)
    private Long hit; // 조회수(기본값 0)

    @Column(name = "HEART", nullable = false)
    private Long heart; // 좋아요 수(기본값 0)

    @ElementCollection // 별도의 테이블 생성
    @CollectionTable(name = "BACKPACKIMAGE", joinColumns = @JoinColumn(name = "BNUM")) // BACKPACKIMAGE 테이블 생성 ->
                                                                                       // BackPack 엔티티와 연결
    @Column(name = "IMGNAME")
    private List<String> imgNames = new ArrayList<>(); // 여러개의 이미지 list형태로 저장

    @ElementCollection // 별도의 테이블 생성
    @CollectionTable(name = "TAG", joinColumns = @JoinColumn(name = "BACKPACKNUM")) // TAG 테이블 생성 -> BackPack 엔티티와 연결
    @Column(name = "TAG") // 태그
    private List<String> tag = new ArrayList<>(); // 여러 개의 이미지 리스트 저장

    // 댓글 목록 (1:N 관계, 게시글 삭제 시 연관된 댓글도 삭제됨)
    @OneToMany(mappedBy = "backpack", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    // @JsonIgnore // JSON 응답에서 댓글 목록을 숨김 (무한 루프 방지)
    private List<B_comm> bcommlist = new ArrayList<>(); // 댓글 목록

}