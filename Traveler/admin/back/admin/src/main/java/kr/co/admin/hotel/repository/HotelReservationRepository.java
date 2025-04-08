package kr.co.admin.hotel.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import kr.co.admin.hotel.entity.HotelReservation;

@Repository
public interface HotelReservationRepository extends JpaRepository<HotelReservation, Long> {
        Page<HotelReservation> findAll(Pageable pageable);
}
