package kr.co.user.hotel.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import kr.co.user.hotel.entity.HotelReservation;

@Repository
public interface HotelReservationRepository extends JpaRepository<HotelReservation, Long> {
    List<HotelReservation> findByStatus(String status);

    List<HotelReservation> findByMembernum(Long membernum);

    Optional<HotelReservation> findById(Long Num);
}
