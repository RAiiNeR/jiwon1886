package kr.co.user.diary;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import kr.co.user.hotel.entity.Hotel;

import java.util.List;

public interface DiaryRepository extends JpaRepository<Diary, Long> {
    // 게시글 번호로 정렬된 전체 게시글 조회
    List<Diary> findAllByOrderByNumDesc();
    
    //최신 공유 9개 다이어리 리스트
    @Query(nativeQuery = true, value = 
    "SELECT num, title, ddate, heart, thumbnail, hit, isshare, membernum " +
    "FROM ( SELECT a.num, a.title, a.ddate, a.heart, a.thumbnail, a.hit, a.isshare, a.membernum, ROWNUM rnum " +
    "    FROM ( SELECT num, title, ddate, heart, thumbnail, hit, isshare, membernum " +
    "        FROM diary WHERE isshare = 1 ORDER BY num DESC ) a WHERE ROWNUM <= 9 ) " +
    "WHERE rnum <= 9")
    List<Diary> shareDiaryList();


    // //공유 다이어리 리스트
    // @Query(nativeQuery = true, value = "SELECT num, title, ddate, heart, thumbnail, hit, isshare, membernum " +
    //     "FROM ( SELECT a.num, a.title, a.ddate, a.heart, a.thumbnail, a.hit, a.isshare, a.membernum, ROWNUM rnum " +
    //     "FROM diary a WHERE a.membernum = :membernum and isshare = 1 ORDER BY a.num DESC ) " +
    //     "WHERE rnum <= 8")
    // List<Object[]> ShareDiaryList(@Param("membernum") Long membernum);


    //나의 다이어리 리스트
    // @Query(nativeQuery = true, value = "SELECT num, title, ddate, heart, thumbnail, hit, isshare, membernum " +
    //     "FROM ( SELECT a.num, a.title, a.ddate, a.heart, a.thumbnail, a.hit, a.isshare, a.membernum, ROWNUM rnum " +
    //     "FROM diary a WHERE a.membernum = :membernum and isshare = 0 ORDER BY a.num DESC ) " +
    //     "WHERE rnum <= 8")
    // List<Object[]> myDiaryList(@Param("membernum") Long membernum);


     // 여러 다이어리의 isshare 값을 1로 업데이트하는 메서드
     @Modifying
     @Transactional
     @Query(nativeQuery = true, value = "UPDATE diary SET isshare = 1 WHERE num IN (:diaryIds)")
     void updateShareStatus(@Param("diaryIds") List<Integer> diaryIds); 

     
    //공유 취소
     @Modifying
     @Transactional
     @Query(nativeQuery = true, value = "UPDATE diary SET isshare = 0 WHERE num IN (:diaryIds)")
     void updateNotShareStatus(@Param("diaryIds") List<Integer> diaryIds);


    //페이징(전체 공유 다이어리 리스트)
    @Query(value = "SELECT * FROM (SELECT d.*, ROW_NUMBER() OVER (ORDER BY d.num DESC) as row_num " +
    "FROM diary d WHERE d.isshare = 1) " +
    "WHERE row_num BETWEEN :startRow AND :endRow", nativeQuery = true)
    List<Diary> findByAllshareAndMembernumOrderByNumDesc(
        @Param("startRow") int startRow,
        @Param("endRow") int endRow);

    @Query(value = "SELECT COUNT(*) FROM Diary d WHERE d.isshare = 1", nativeQuery = true)
    int countByAllshareAndMembernum();



    // 페이징(나의공유다이어리리스트)
    @Query(value = "SELECT * FROM (SELECT d.*, ROW_NUMBER() OVER (ORDER BY d.num DESC) as row_num " +
        "FROM diary d WHERE d.isshare = 1 and d.membernum = :membernum) " +
        "WHERE row_num BETWEEN :startRow AND :endRow", nativeQuery = true)
    List<Diary> findByIsshareAndMembernumOrderByNumDesc(
            @Param("membernum") int membernum,
            @Param("startRow") int startRow,
            @Param("endRow") int endRow);

    @Query(value = "SELECT COUNT(*) FROM Diary d WHERE d.isshare = 1 and d.membernum = :membernum", nativeQuery = true)
    int countByIsshareAndMembernum(@Param("membernum") int membernum);


    // 페이징(나의다이어리리스트)
    @Query(value = "SELECT * FROM (SELECT d.*, ROW_NUMBER() OVER (ORDER BY d.num DESC) as row_num " +
        "FROM diary d WHERE d.isshare = 0 and d.membernum = :membernum) " +
        "WHERE row_num BETWEEN :startRow AND :endRow", nativeQuery = true)
    List<Diary> findByIsMyAndMembernumOrderByNumDesc(
            @Param("membernum") int membernum,
            @Param("startRow") int startRow,
            @Param("endRow") int endRow);

    @Query(value = "SELECT COUNT(*) FROM Diary d WHERE d.isshare = 0 and d.membernum = :membernum", nativeQuery = true)
    int countByIsMyAndMembernum(@Param("membernum") int membernum);



    
}