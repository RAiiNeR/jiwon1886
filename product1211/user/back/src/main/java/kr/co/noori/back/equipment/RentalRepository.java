package kr.co.noori.back.equipment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RentalRepository extends JpaRepository<Rental, Long> {
    List<Rental> findTopByEquipmentRnameAndStatusOrderByReservedTimeDesc(String rname, String status);

    //신청 기록
    @Modifying
    @Query(value = "INSERT INTO rental VALUES(rental_seq.NEXTVAL, :quantity, SYSDATE, CURRENT_TIMESTAMP, :status, :item_id, :user_id)", nativeQuery = true)
    void insert(@Param("quantity") int quantity, 
                        @Param("status") String status, 
                        @Param("item_id") Long itemId, 
                        @Param("user_id") Long userId);
}
