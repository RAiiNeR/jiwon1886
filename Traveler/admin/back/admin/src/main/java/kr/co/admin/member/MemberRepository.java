package kr.co.admin.member;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

public interface MemberRepository extends JpaRepository<MemberVO, Long> {
    @Query(value = "SELECT num, USERNAME, EMAIL, MDATE from MEMBER ORDER BY 1 DESC", nativeQuery = true)
    List<MemberVO> findAllMember();

    @Modifying // delete나 update같은 데이터 변경 쿼리를 사용할 때 쓰는 어노테이션
    @Transactional // delete나 update같은 쿼리 실행할 때 트랜잭션 처리를 위해 필요
    @Query("DELETE FROM MemberVO m WHERE m.num=:num")
    void deleteMemberByNum(Long num);

    // 페이징 처리
    @Query(value = "SELECT * FROM(SELECT b.* , ROW_NUMBER() OVER(ORDER BY b.num DESC) as row_num " +
            " FROM MEMBER b) WHERE row_num  BETWEEN :startRow AND :endRow", nativeQuery = true)
    List<MemberVO> findByNumWithPagination(@Param("startRow") int startRow, @Param("endRow") int endRow);

    @Query(value = "SELECT COUNT(*) FROM MEMBER", nativeQuery = true)
    Long countAllMember();


}
