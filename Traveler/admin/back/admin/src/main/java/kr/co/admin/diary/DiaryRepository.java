package kr.co.admin.diary;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import kr.co.admin.hotel.entity.HotelReservation;

import java.util.List;

public interface DiaryRepository extends JpaRepository<Diary, Long> {
    // 게시글 번호로 정렬된 전체 게시글 조회
    List<Diary> findAllByOrderByNumDesc();


    //페이징(전체 공유 다이어리 리스트)
    @Query(value = "SELECT * FROM (SELECT d.*, ROW_NUMBER() OVER (ORDER BY d.num DESC) as row_num " +
    "FROM diary d) " +
    "WHERE row_num BETWEEN :startRow AND :endRow", nativeQuery = true)
    List<Diary> findByAllshareAndMembernumOrderByNumDesc(
        @Param("startRow") int startRow,
        @Param("endRow") int endRow);

    @Query(value = "SELECT COUNT(*) FROM Diary d", nativeQuery = true)
    int countByAllshareAndMembernum();


    List<Diary> findByMembernum(Long membernum);
    
    @Query(value = "SELECT COUNT(*) FROM Diary " ,nativeQuery = true)
    long countDiaries();

    @Query(value = "SELECT COUNT(*) FROM Diary where isshare =1" ,nativeQuery = true)
    long countShareDiaries();

    @Query(value = "SELECT COUNT(*) FROM Diary where isshare = 0" ,nativeQuery = true)
    long countMyDiaries();
    
}