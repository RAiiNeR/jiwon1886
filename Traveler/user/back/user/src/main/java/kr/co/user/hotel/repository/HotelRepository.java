package kr.co.user.hotel.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import kr.co.user.hotel.entity.Hotel;

// 2025-02-15 황보도연 추가 
@Repository
public interface HotelRepository extends JpaRepository<Hotel, Long> {

        List<Hotel> findAllByOrderByNumDesc();

        @Query(value = "SELECT * FROM (SELECT h.*, ROW_NUMBER() OVER (ORDER BY h.num DESC) as row_num " +
                        "FROM HOTEL h WHERE h.name LIKE %:searchQuery% OR h.location LIKE %:searchQuery%) " +
                        "WHERE row_num BETWEEN :startRow AND :endRow", nativeQuery = true)
        List<Hotel> findByNameOrLocationContainingOrderByNumDesc(
                        @Param("searchQuery") String searchQuery,
                        @Param("startRow") int startRow,
                        @Param("endRow") int endRow);

        @Query(value = "SELECT * FROM (SELECT h.*, ROW_NUMBER() OVER (ORDER BY h.num DESC) as row_num " +
                        "FROM HOTEL h WHERE h.membernum = :num) " +
                        "WHERE row_num BETWEEN :startRow AND :endRow", nativeQuery = true)
        List<Hotel> findByMemberumOrderByNumDesc(
                        @Param("startRow") int startRow,
                        @Param("endRow") int endRow,
                        @Param("num") int num);

        @Query(value = "SELECT COUNT(*) FROM HOTEL h WHERE h.name LIKE %:searchQuery% OR h.location LIKE %:searchQuery%", nativeQuery = true)
        int countByNameOrLocationContaining(@Param("searchQuery") String searchQuery);
        
        @Query(value = "SELECT COUNT(*) FROM HOTEL h WHERE h.membernum = :num", nativeQuery = true)
        int countByMembernumContaining(@Param("num") int num);

}