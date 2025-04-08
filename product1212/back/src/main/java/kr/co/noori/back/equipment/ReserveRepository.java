package kr.co.noori.back.equipment;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

public interface ReserveRepository extends JpaRepository<Reserve, Long>{
    public List<Reserve> findByEquipmentAndStatus(Equipment equipment, ReservationStatus status);

    @Modifying
    @Transactional
    @Query(value = "INSERT INTO reserve VALUES(reserve_seq.NEXTVAL, :recnt, :remail, :requip, :reuid, :rname)", nativeQuery = true)
    void reserve(@Param("recnt") int recnt,
                    @Param("remail") String remail,
                    @Param("requip") Long requip,
                    @Param("reuid") Long reuid,
                    @Param("rname") Long rname);
}
