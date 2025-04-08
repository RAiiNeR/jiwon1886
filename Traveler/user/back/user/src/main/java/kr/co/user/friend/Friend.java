package kr.co.user.friend;

import java.util.Date;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import kr.co.user.member.MemberVO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@Getter
@Setter
@Entity
@Table(name = "FRIEND")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Friend {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Friendid")
    private Long Friendid; // 친구번호

    @Column(name = "Arewefriend", nullable = false)
    private boolean Arewefriend; // 친구인지 여부

    // Member 엔티티와 연관매핑
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "Touserid")
    private MemberVO touserid; // ~친구요청 받는사람

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "Fromuserid")
    private MemberVO fromuserid; // 친구요청하는사람

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "Fdate", nullable = false, updatable = false)
    private Date Fate; // 친구된 날

}
