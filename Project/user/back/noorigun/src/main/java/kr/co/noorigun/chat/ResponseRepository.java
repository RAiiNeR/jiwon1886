package kr.co.noorigun.chat;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ResponseRepository extends JpaRepository<Response, Long> {
    Optional<Response> findByKey(String key); // key로 응답을 조회하는 메서드
}
