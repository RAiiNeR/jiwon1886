package kr.co.noori.back.equipment;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReservationRepository extends JpaRepository<Reservation, Long>{
    public List<Reservation> findByEquipmentAndStatusOrderByReservedTimeAsc(Equipment equipment, ReservationStatus status);
<<<<<<< HEAD
=======

>>>>>>> 92962a935f5864cff0ee04ea1dbed5d80dee9300
}
