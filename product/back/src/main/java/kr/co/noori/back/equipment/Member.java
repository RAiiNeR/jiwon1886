package kr.co.noori.back.equipment;

import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
@Entity
@Table(name = "member")
public class Member {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "member_seq_gen")
    @SequenceGenerator(name = "member_seq_gen", sequenceName = "member_seq", allocationSize = 1)
    private Long num;

    @Column(name = "name", length = 50, nullable = false) // nullable = false , null이 불가능!
    private String name;

    @Column(name = "id", unique = true, length = 15, nullable = false)
    private String id;


    //-----------------------------
    // 한 명의 회원은 여러 개의 예약을 가질 수 있습니다.
    @OneToMany(mappedBy = "member")
    private List<Reservation> reservations; // 회원의 모든 예약 리스트

    @Column(name = "email", length = 100, nullable = false)
    private String email;  // 이메일 필드 추가

}