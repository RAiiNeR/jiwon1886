package kr.co.ict.back.security;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long>{
    //jdk8이후 사용됨
    //결과가 없는 경우 Optional.empty()를 반환. 결과가 있는 경우 Optional.of(결과)를 반환
    //데이터베이스에서 사용자가 있으면 사용자를 반환. 아니면 Optional.empty()를 반환한다.
    Optional<User> findByUsername(String username);
}
