package kr.co.noori.back.dept;

import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import kr.co.noori.back.compleboard.CompleBoard;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "dept")
public class Dept {
    @Id
    private Long deptno;
    private String dname;

    @OneToMany
    @JoinColumn(name = "deptno")
    private List<CompleBoard> compleList;
}
