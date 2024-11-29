package kr.co.noori.back.compleboard;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CompleBoardRepository extends JpaRepository<CompleBoard, Long>{
    List<CompleBoard> findAllByOrderByNumDesc(); //DB에 있는 모든 객체 찾기

    //각 부서의 처리상태 보기
    //deptno니까 전에했던거 연결할때 dname이 아니라 deptno로 수정해야함
    @Query(value = "SELECT deptno, (SELECT COUNT(*) FROM compleboard c WHERE c.deptno = :deptno AND c.state = '처리완료') AS 처리완료, " +
        "(SELECT COUNT(*) FROM compleboard c WHERE c.deptno = :deptno AND c.state = '처리중') AS 처리중, " +
        "(SELECT COUNT(*) FROM compleboard c WHERE c.deptno = :deptno AND c.state = '미처리') AS 미처리, " +
        "(SELECT COUNT(*) FROM compleboard c WHERE c.deptno = :deptno AND c.state = '보류') AS 보류, " +
        "(SELECT COUNT(*) FROM compleboard c WHERE c.deptno = :deptno AND c.state = '폐기') AS 폐기 " +
        "FROM compleboard"
        , nativeQuery = true)
    List<CompleBoard> findByDeptnoContaining(@Param("deptno") Long deptno);
}