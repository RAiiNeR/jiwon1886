package kr.co.admin.userList;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.criteria.CriteriaBuilder.In;
import kr.co.admin.member.MemberVO;

public interface UserListRepository extends JpaRepository<MemberVO, Long> {
    // 전체 회원목록 조회(회원번호, 이름, 이메일, 가입일, 친구목록)
    @Query(value = "SELECT num,name,email,mdate FROM MEMBER", nativeQuery = true)
    List<Object[]> findAllMemberList();

    @Query(value = "SELECT m.name, m.email " +
            "FROM MEMBER m " +
            "JOIN FRIEND f ON (m.num = f.Touserid OR m.num = f.Fromuserid) " +
            "WHERE (f.Touserid = :num OR f.Fromuserid = :num) " +
            "AND f.Arewefriend = 1 " +
            "ORDER BY m.name DESC", nativeQuery = true)
    List<Object[]> findFriendNamesAndEmailsByUserNum(@Param("num") Integer num);

    // 회원 삭제(한명만)
    @Transactional
    @Modifying
    @Query(value = "DELETE FROM MEMBER WHERE num = :num", nativeQuery = true)
    void deleteMemberByNum(@Param("num") Integer num);

    // 회원 체크한사람들 삭제(체크리스트 기능)
    @Transactional
    @Modifying
    @Query(value = "DELETE FROM MEMBER WHERE num IN (:numList)", nativeQuery = true)
    void deleteMembersByNums(@Param("numList") List<Integer> numList);

    // 회원 삭제 시 친구관계 삭제
    // 단일 회원 삭제 및 다중 회원 삭제 시, 해당 회원과 친구인 관계도 삭제
    // @Transactional
    // @Modifying
    // @Query(value = "DELETE FROM FRIEND WHERE Touserid IN (:numList) OR Fromuserid
    // IN (:numList) " +
    // "DELETE FROM MEMBER WHERE num IN (:numList)", nativeQuery = true)
    // void deleteMembersAndFriendships(@Param("numList") List<Integer> numList);
    @Transactional
    @Modifying
    @Query(value = "DELETE FROM FRIEND WHERE Touserid IN (:numList) OR Fromuserid IN (:numList)", nativeQuery = true)
    void deleteFriendshipsByNumList(@Param("numList") List<Integer> numList);

    @Modifying
    @Query(value = "DELETE FROM FRIEND WHERE Touserid = :num OR Fromuserid = :num", nativeQuery = true)
    void deleteFriendshipsByNumList(@Param("num") Integer num);

    // 페이징 처리
    @Query(value = "SELECT num,name,email,mdate FROM (SELECT num,name,email,mdate, ROW_NUMBER() OVER (ORDER BY num DESC) as row_num "
            +
            " FROM MEMBER WHERE name LIKE %:name%) WHERE row_num BETWEEN :startRow AND :endRow", nativeQuery = true)
    List<Object[]> findWithPaging(@Param("name") String name, @Param("startRow") int startRow,
            @Param("endRow") int endRow);

}
