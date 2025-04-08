package kr.co.user.hotel.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import kr.co.user.hotel.entity.Room;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {
    List<Room> findByHotelNum(Long hotelNum);

    // 또는, @Query 사용 시
    // @Query("SELECT r FROM Room r WHERE r.hotelNum = :hotelNum")
    // List<Room> findByHotelNum(@Param("hotelNum") Long hotelNum);
}
