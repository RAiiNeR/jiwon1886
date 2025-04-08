package kr.co.mypage.back.mypage;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import kr.co.mypage.back.compleboard.CompleBoard;

public interface MyPageRepository extends JpaRepository<MyPage, Long>{
    Optional<MyPage> findById(String id); // id로 단일 MyPage 객체를 조회
    List<MyPage> findAll();
    
    // 나머지 쿼리도 동일
    @Query(value = "SELECT name, phone, email, addr FROM member WHERE id=:id", nativeQuery = true)
    List<MyPage> findByMyId(@Param("id") String id);

    //name 뺐었음
    @Query(value = "UPDATE MEMBER SET phone=:phone, email=:email, addr=:addr WHERE id=:id", nativeQuery = true)
    List<MyPage> updateMyPage(@Param("id") String id, 
        @Param("phone") String phone, @Param("email") String email, @Param("addr") String addr);

    //해당 id가 작성한 글의 갯수를 보여주는 쿼리문 작성
    //현재는 mnum이 없기 때문에 게시글의 전체 갯수를 보여주는 방식으로 구현함
    @Query(value = "SELECT COUNT(*) FROM COMPLEBOARD", nativeQuery = true)
    List<CompleBoard> findCountList();
}