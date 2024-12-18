package kr.co.noori.back.equipment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface RentalRepository extends JpaRepository<Rental, Long> {
    //신청 기록
    @Modifying
    @Query(value = "INSERT INTO rental VALUES(rental_seq.NEXTVAL, :rcnt, SYSDATE, :item_id, :user_id)", nativeQuery = true)
    void insert(@Param("rcnt") int rcnt, 
                        @Param("item_id") Long itemId, 
                        @Param("user_id") Long userId);
}