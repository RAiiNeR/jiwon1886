package kr.co.noori.back.equipment;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReservationRepository extends JpaRepository<Reservation, Long>{
    public List<Reservation> findByEquipmentAndStatusOrderByReservedTimeAsc(Equipment equipment, ReservationStatus status);

}
