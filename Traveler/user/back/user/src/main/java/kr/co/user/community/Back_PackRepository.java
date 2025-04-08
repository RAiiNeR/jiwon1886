package kr.co.user.community;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

// JpaRepository를 상속받아 CRUD 기능 제공
public interface Back_PackRepository extends JpaRepository<Back_Pack, Long> {

    List<Back_Pack> findAllByOrderByNumDesc(); // 모든 게시글을 num(게시글 ID)의 내림차순으로 정렬하여 조회하는 메서드

    // 특정 게시글 번호(num)로 게시글을 조회하는 메서드 (Native Query 사용)
    @Query(value = "SELECT * FROM BACKPACK WHERE NUM = :num", nativeQuery = true)
    Optional<Back_Pack> findByNum(@Param("num") Long num);

    // 특정 단어(title)를 포함하는 게시글을 조회하고, 해당 게시글의 상세 정보를 함께 가져오는 쿼리
    @Query(value = """
                SELECT
                    b.num,
                    m.name AS memberName,
                    b.title,
                 TO_CHAR(b.content) AS content,
                    b.hit,
                    b.cdate,
                    b.heart,
                    b.membernum,
                    COALESCE((
                        SELECT LISTAGG(i.imgname, ',') WITHIN GROUP (ORDER BY i.imgname)
                        FROM BACKPACKIMAGE i WHERE i.bnum = b.num
                    ), '') AS img_names,
                    COALESCE((
                        SELECT LISTAGG(t.tag, ',') WITHIN GROUP (ORDER BY t.tag)
                        FROM TAG t WHERE t.backpacknum = b.num
                    ), '') AS tag
                FROM (
                    SELECT b.*, ROW_NUMBER() OVER(ORDER BY b.num DESC) AS row_num
                    FROM BACKPACK b
                    WHERE b.title LIKE CONCAT('%', :title, '%')
                ) b
                JOIN MEMBER m ON b.membernum = m.num
                WHERE b.row_num BETWEEN :startRow AND :endRow
            """, nativeQuery = true)
    List<Map<String, Object>> findByTitleContainingOrderByNumDesc(
            @Param("title") String title, // 검색할 제목 키워드
            @Param("startRow") int startRow, // 조회할 시작 행
            @Param("endRow") int endRow); // 조회할 마지막 행

    // 특정 단어(title)를 포함하는 데이터를 검색하여 그 개수를 반환하는 메서드
    @Query(value = "SELECT COUNT(*) FROM backpack b WHERE b.title LIKE %:title%", nativeQuery = true)
    int countByTitleContaining(@Param("title") String title);

}