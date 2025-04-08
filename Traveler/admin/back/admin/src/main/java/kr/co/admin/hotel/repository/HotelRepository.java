package kr.co.admin.hotel.repository;

import org.springframework.data.domain.Pageable;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import kr.co.admin.hotel.entity.Hotel;

@Repository
public interface HotelRepository extends JpaRepository<Hotel, Long> {

        // 최신 순으로 호텔 목록 조회
        Page<Hotel> findAllByOrderByNumDesc(Pageable pageable);

        Optional<Hotel> findByNum(Long num); // Hotel 번호로 Hotel 조회

        // 이름으로 검색하고 최신 순으로 호텔 목록 조회
        Page<Hotel> findByNameContainingIgnoreCaseOrderByNumDesc(String name, Pageable pageable);

}
