package kr.co.noorigun.compleboard;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CcommRepository extends JpaRepository<Ccomm, Long> {
        // 특정 게시글 번호 cbnum에 해당하는 댓글 최신순으로 정렬
        List<Ccomm> findAllByCbnumOrderByNumDesc(Long cbnum);

        @Query(value = "select count(*) from ccomm where cbnum=:cbnum", nativeQuery = true)
        int countByCbnum(@Param("cbnum") Long cbnum);

        // @Query(value = "SELECT * FROM ccomm ORDER BY NUM DESC", nativeQuery = true)
        // List<Ccomm> getList(); -> 11행 코드와 중복사용으로 주석처리

        @Query(value = "SELECT * FROM (SELECT c.*, ROW_NUMBER() OVER (ORDER BY c.num DESC) as row_num " +
                        " FROM ccomm c WHERE c.cbnum LIKE %:cbnum%) WHERE row_num BETWEEN :startRow AND :endRow ", nativeQuery = true)
        List<Ccomm> findByCbnumContainingOrderByNumDesc(@Param("cbnum") Long cbnum,
                        @Param("startRow") int startRow,
                        @Param("endRow") int endRow);

        // 페이징 처리를 위해 총 게시물 수를 가져오는데 사용
        @Query(value = "SELECT COUNT(*) FROM ccomm c WHERE c.cbnum LIKE %:cbnum%", nativeQuery = true)
        int countByCbnumContaining(@Param("cbnum") Long cbnum); // 게시물에 맞는 총 개수 가져옴

}
