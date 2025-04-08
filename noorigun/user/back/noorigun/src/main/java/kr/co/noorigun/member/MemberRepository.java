package kr.co.noorigun.member;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface MemberRepository extends JpaRepository<Member,Long>{
    Optional<Member> findById(String id); // 아이디를 기준으로 회원정보 조회

    Optional<Member> findByEmail(String email); // 이메일을 기준으로 회원정보 조회

    // 이메일을 기준으로 중복된 회원 수 확인
    @Query(value = "SELECT COUNT(*) FROM MEMBER WHERE EMAIL = :email", nativeQuery = true)
    int countByEmail(@Param("email") String email);

    // 아이디를 기준으로 중복된 회원 수 확인
    @Query(value = "SELECT COUNT(*) FROM MEMBER WHERE ID = :id", nativeQuery = true)
    int checkId(@Param("id") String id);

    // 이름과 이메일, 번호를 기준으로 중복된 회원 수 확인
    @Query(value = """
            SELECT COUNT(*) FROM MEMBER WHERE NAME = :name AND REPLACE(PHONE,'-','') = :phone OR EMAIL = :email            
            """, nativeQuery = true)
    int ckeckMember(@Param("name") String name,
        @Param("email") String email,
        @Param("phone") String phone
    );
}
