package kr.co.user.member;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface MemberRepository extends JpaRepository<MemberVO, Long> {

    // 아이디로 회원 조회 
    @Query(value = "SELECT * FROM MEMBER WHERE USERNAME = :username", nativeQuery = true)
    Optional<MemberVO> findByUsername(@Param("username") String username);

    // 이메일로 회원 조회 
    @Query(value = "SELECT * FROM MEMBER WHERE EMAIL = :email", nativeQuery = true)
    Optional<MemberVO> findByEmail(@Param("email") String email);

    // 아이디가 존재하는지 확인 
    // SELECT COUNT(*) FROM MEMBER WHERE username='test1';
    @Query(value = "SELECT  COUNT(*) FROM MEMBER WHERE USERNAME = :username", nativeQuery = true)
    int existsByUsername(@Param("username") String username);

    // 이메일이 존재하는지 확인 
    @Query(value = "SELECT COUNT(*) FROM MEMBER WHERE EMAIL = :email", nativeQuery = true)
    int existsByEmail(@Param("email") String email);

    // 주민등록번호와 사업자번호 조회
    @Query(value = "SELECT * FROM MEMBER WHERE CODE = :code", nativeQuery = true)
    Optional<MemberVO> findByCode(@Param("code") String code);
}