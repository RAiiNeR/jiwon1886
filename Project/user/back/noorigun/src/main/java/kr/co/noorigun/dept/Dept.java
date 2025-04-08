package kr.co.noorigun.dept;

import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import kr.co.noorigun.compleboard.CompleBoard;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "dept")
public class Dept {
    @Id
    private Long deptno;
    @Column(length = 50)
    private String dname;

    // CompleBoard 엔티티와 1:N 관계
    // deptno 컬럼을 기준으로 조인
    @OneToMany
    @JoinColumn(name = "deptno")
    private List<CompleBoard> compleList; // 해당 부서에 속한 CompleBoard
}
