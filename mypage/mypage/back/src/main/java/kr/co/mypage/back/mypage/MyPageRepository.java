package kr.co.mypage.back.mypage;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface MyPageRepository extends JpaRepository<MyPage, Long>{
    // Optional<MyPage> myPage(String id); // 사용자의 id로 조회
    // List<MyPage> findAll();

    // // 로그인한 사용자의 정보를 보여주는 list
    // // id를 String으로 처리하도록 쿼리 수정
    // @Query(value = "SELECT name, phone, email, addr FROM member WHERE id=:id", nativeQuery = true)
    // List<MyPage> findById(@Param("id") String id);

    // // 사용자의 정보를 수정하는 update (다중컬럼 활용)
    // @Query(value = "UPDATE MEMBER SET name=:name, phone=:phone, email=:email, addr=:addr WHERE id=:id", nativeQuery = true)
    // List<MyPage> updateMyPage(@Param("id") String id, @Param("name") String name, 
    //     @Param("phone") String phone, @Param("email") String email, @Param("addr") String addr);
    Optional<MyPage> findById(String id); // id로 단일 MyPage 객체를 조회
    List<MyPage> findAll();
    
    // 나머지 쿼리도 동일
    @Query(value = "SELECT name, phone, email, addr FROM member WHERE id=:id", nativeQuery = true)
    List<MyPage> findByMyId(@Param("id") String id);

    @Query(value = "UPDATE MEMBER SET name=:name, phone=:phone, email=:email, addr=:addr WHERE id=:id", nativeQuery = true)
    List<MyPage> updateMyPage(@Param("id") String id, @Param("name") String name, 
        @Param("phone") String phone, @Param("email") String email, @Param("addr") String addr);

}