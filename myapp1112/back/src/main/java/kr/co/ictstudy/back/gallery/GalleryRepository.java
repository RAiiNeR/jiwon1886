package kr.co.ictstudy.back.gallery;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface GalleryRepository extends JpaRepository<Gallery, Long> {
    // 최신순으로 정렬된 Gallery 목록을 반환하는 메서드
    List<Gallery> findAllByOrderByIdDesc();

    // 페이징 처리를 위한 메서드
    /*
     * SELECT id, title, writer, description, g_date, gdate
     * FROM (
     * SELECT id, title, writer, description, g_date, gdate,
     * ROW_NUMBER() OVER(ORDER BY id DESC) AS row_num
     * FROM gallery
     * WHERE title LIKE '%%'
     * ) numbered_rows
     * WHERE row_num BETWEEN 1 AND 10;
     */
    @Query(value = "SELECT * FROM (SELECT g.*, ROW_NUMBER() OVER (ORDER BY g.id DESC) as row_num "+
    "FROM gallery g WHERE g.title LIKE %:title%) WHERE row_num BETWEEN :startRow AND :endRow", nativeQuery = true)
    List<Gallery> findByTitleContainingOrderByIdDesc(@Param("title") String title, @Param("startRow") int startRow,
            @Param("endRow") int endRow);

    @Query(value = "SELECT COUNT(*) FROM gallery g WHERE g.title LIKE %:title%", nativeQuery = true)
    int countByTitleContaining(@Param("title") String title);
}
