package kr.co.mypage.back.mypage;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface MyPageRepository extends JpaRepository<MyPage, Long>{
    // 로그인한 사용자의 정보를 보여주는 list
    // @Query(value = "")
    List<MyPage> myList();

    // 사용자의 정보를 수정하는 update (다중컬럼 활용)
    @Query(value = "UPDATE MEMBER SET name=:name, phone=:phone, email=:email, addr=:addr WHERE num=:id", nativeQuery = true)
    List<MyPage> updateMyPage(@Param("id") String id, @Param("name") String name, 
        @Param("phone") String phone, @Param("email") String email, @Param("addr") String addr);
}
