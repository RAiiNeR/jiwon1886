package kr.co.admin.userList;

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
import kr.co.admin.member.MemberVO;
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
    private Long Friendid;

    @Column(name = "Arewefriend", nullable = false)
    private boolean Arewefriend;

    // Member 엔티티와 연관매핑
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "Touserid")
    private MemberVO touserid;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "Fromuserid")
    private MemberVO fromuserid;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "Fdate", nullable = false, updatable = false)
    private Date Fate;
}
