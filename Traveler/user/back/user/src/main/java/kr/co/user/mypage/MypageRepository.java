package kr.co.user.mypage;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import kr.co.user.member.MemberVO;

public interface MypageRepository extends JpaRepository<MemberVO, Long> {
        // 특정 회원의 id조회하는 쿼리
        @Query(value = "SELECT USERNAME FROM MEMBER WHERE NUM = :num", nativeQuery = true)
        String findUsernameByNum(@Param("num") Integer num);

        // 사용자 정보 조회
        @Query(value = "SELECT * FROM MEMBER WHERE NUM = :num", nativeQuery = true)
        MemberVO findUserByNum(@Param("num") Integer num);

        // 예약 내역 5개 조회
        // HOTELRESERVATION → ROOM → HOTEL을 JOIN하여 특정 회원이 예약한 호텔 내용을 가져옴
        // CHECKINDATE 기준으로 최근 5개의 호텔 정보만 가져옵니다.
        @Query(value = "SELECT h.CONTENT " +
                        "FROM HOTELRESERVATION hr " +
                        "JOIN ROOM r ON hr.ROOMNUM = r.NUM " +
                        "JOIN HOTEL h ON r.HOTELNUM = h.NUM " +
                        "WHERE hr.MEMBEREMAIL = :email " +
                        "ORDER BY hr.CHECKINDATE DESC FETCH FIRST 5 ROWS ONLY", nativeQuery = true)
        List<Object[]> findLatestHotelContentsByEmail(@Param("email") String email);

        // 사용자가 올린 여행 블로그 글 (최신순 3개)
        // BACKPACK 테이블에서 특정 회원이 작성한 최신 3개의 블로그 글제목을 조회
        @Query(value = "SELECT title FROM (SELECT b.title FROM BACKPACK b " +
                        "JOIN MEMBER m ON b.MEMBERNUM = m.NUM " +
                        "WHERE m.NUM = :num ORDER BY b.CDATE DESC) WHERE ROWNUM <= 3", nativeQuery = true)
        List<String> findRecentBackPack(@Param("num") Integer num);

        // 사용자가 최근 작성한 일기 4개 조회
        // DIARY 테이블의 MEMBERNUM 컬럼과 MEMBER 테이블의 NUM 컬럼을 연결
        // 특정 회원이 작성한 최신 4개의 일기 테이블에서 (NUM, TITLE)를 조회
        @Query(value = "SELECT d.NUM, d.TITLE FROM DIARY d " +
                        "JOIN MEMBER m ON d.MEMBERNUM = m.NUM " +
                        "WHERE m.NUM = :num " +
                        "ORDER BY d.DDATE DESC FETCH FIRST 4 ROWS ONLY", nativeQuery = true)
        List<Object[]> findRecentDiaries(@Param("num") Integer num);

        // 최신 여행콘텐츠
        @Query(value = "SELECT t.CONTENT " +
                        "FROM TOUR t " +
                        "ORDER BY t.TDATE DESC FETCH FIRST 3 ROWS ONLY", nativeQuery = true)
        List<Object[]> findTourContents();

        // 사용자가 최근 본 호텔 콘텐츠 3개 조회
        @Query(value = "SELECT h.CONTENT " +
                        "FROM HOTEL h " +
                        "ORDER BY h.HDATE DESC FETCH FIRST 3 ROWS ONLY", nativeQuery = true)
        List<Object[]> findHotelContents();

                // //버스 예매 내역  2025-03-12
                // //, b.DEPARTUREOFTIME, b.DESTINATION, b.DESTINATIONOFTIME, b.SITNUM
                // @Query(value = "SELECT b.DEPARTURE" +
                // "FROM Bus b " + 
                // "ORDER BY b.schedule DESC FETCH FIRST 5 ROWS ONLY" , nativeQuery = true)
                // List<Object[]> findBusList();
}