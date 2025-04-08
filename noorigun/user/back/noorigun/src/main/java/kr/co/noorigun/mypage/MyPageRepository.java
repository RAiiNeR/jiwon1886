package kr.co.noorigun.mypage;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import kr.co.noorigun.member.Member;

public interface MyPageRepository extends JpaRepository<Member, Long> {
    Optional<Member> findById(String id); // id로 단일 MyPage 객체를 조회

    List<Member> findAll();

    // 나머지 쿼리도 동일
    @Query(value = "SELECT name, phone, email, addr FROM member WHERE id=:id", nativeQuery = true)
    List<Member> findByMyId(@Param("id") String id);

    // name 뺐었음
    @Query(value = "UPDATE MEMBER SET phone=:phone, email=:email, addr=:addr WHERE id=:id", nativeQuery = true)
    List<Member> updateMyPage(@Param("id") String id,
            @Param("phone") String phone, @Param("email") String email, @Param("addr") String addr);

    // 해당 id가 작성한 글의 갯수를 보여주는 쿼리문 작성
    // 현재는 mnum이 없기 때문에 게시글의 전체 갯수를 보여주는 방식으로 구현함
    // @Query(value = "SELECT COUNT(*) FROM COMPLEBOARD WHERE ", nativeQuery = true)
    // Long findCountList();

    // 해당 id가 어디에 게시글을 올렸으며 현재 그 글의 상태가 어떤지, 상태마다 몇개가 있는지의 쿼리
    // @Query(value = "SELECT d.deptno, d.dname, "
    // + "SUM(CASE WHEN c.state = '채택' THEN 1 ELSE 0 END) AS completed, "
    // + "SUM(CASE WHEN c.state = '논의 중' THEN 1 ELSE 0 END) AS in_progress, "
    // + "SUM(CASE WHEN c.state = '등록' THEN 1 ELSE 0 END) AS received "
    // + "FROM dept d LEFT JOIN compleboard c ON d.deptno = c.deptno LEFT JOIN
    // member m ON c.mnum = m.num "
    // + "WHERE m.id=:id AND d.deptno NOT IN (1, 10, 20, 30) GROUP BY d.deptno,
    // d.dname ORDER BY d.deptno", nativeQuery=true)
    @Query(value = """
            SELECT
                SUM(CASE WHEN c.state = '접수중' THEN 1 ELSE 0 END) AS accepting,
                SUM(CASE WHEN c.state = '담당부서 지정' THEN 1 ELSE 0 END) AS designatedept,
                SUM(CASE WHEN c.state = '처리 중' THEN 1 ELSE 0 END) AS receipting,
                SUM(CASE WHEN c.state = '완료' THEN 1 ELSE 0 END) AS receipt,
                COUNT(*) AS total
            FROM compleboard c LEFT JOIN member m ON c.mnum = m.num
            WHERE m.ID = :id
            """, nativeQuery = true)
    Map<String, String> findByIdCountingState(@Param("id") String id);

    // 제안게시물 쿼리
    @Query(value = """
                SELECT 
                    SUM(CASE WHEN s.state = '채택' THEN 1 ELSE 0 END) AS completed,
                    SUM(CASE WHEN s.state = '논의 중' THEN 1 ELSE 0 END) AS in_progress,
                    SUM(CASE WHEN s.state = '등록' THEN 1 ELSE 0 END) AS received,
                    COUNT(*) AS total
                FROM suggestion s 
                LEFT JOIN member m ON m.num = s.mnum
                WHERE m.id=:id
            """, nativeQuery = true)
    Map<String, String> findByIdCountingSuggestion(@Param("id") String id);

    // 2024-12-11추가 개인 프로그램 신청 현황
    @Query(value = "SELECT * FROM program p, Registry r WHERE p.num=r.CLASSNUM " +
            "and r.MEMBERNUM=:num", nativeQuery = true)

    List<Map<String, String>> findByIdCountingProgram(@Param("num") Long num);
}