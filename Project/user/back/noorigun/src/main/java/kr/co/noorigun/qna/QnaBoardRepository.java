package kr.co.noorigun.qna;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface QnaBoardRepository extends JpaRepository<QnaBoard, Long> {

        // 모든 게시글을 num 내림차순으로 조회
        @Query("SELECT b FROM QnaBoard b ORDER BY b.num DESC")
        List<QnaBoard> findAllByOrderByNumDesc();

        /*
         * SELECT NUM, HIT, PARENTNUM, QDATE, TITLE, WRITER FROM (
         * SELECT qna.NUM, qna.HIT, qna.PARENTNUM, qna.QDATE, qna.TITLE, qna.WRITER,
         * ROWNUM AS ROW_NUM
         * FROM (SELECT q.NUM, q.HIT, q.PARENTNUM, q.QDATE, q.TITLE, q.WRITER
         * FROM QNABOARD q
         * START WITH PARENTNUM IS NULL
         * CONNECT BY PRIOR q.NUM = q.PARENTNUM
         * ORDER SIBLINGS BY NUM DESC) qna
         * ) WHERE ROW_NUM BETWEEN 1 AND 10 ORDER BY ROW_NUM;
         */
        // 제목, 작성자, 내용에 대해 LIKE 검색한 후, row_num을 기반으로 페이징 처리
        @Query(value = """
                        SELECT NUM, HIT, PARENTNUM, QDATE, TITLE, WRITER, CONTENT, MNUM FROM (
                        SELECT qna.NUM, qna.HIT, qna.PARENTNUM, qna.QDATE, qna.TITLE, qna.WRITER, qna.CONTENT, qna.MNUM, ROWNUM AS ROW_NUM
                        FROM (SELECT q.NUM, q.HIT, q.PARENTNUM, q.QDATE, q.TITLE, q.WRITER, q.CONTENT, q.MNUM
                        FROM QNABOARD q
                        WHERE q.title LIKE %:title% AND q.writer LIKE %:writer% AND q.content LIKE %:content%
                        START WITH PARENTNUM IS NULL
                        CONNECT BY PRIOR q.NUM = q.PARENTNUM
                        ORDER SIBLINGS BY NUM DESC) qna
                        ) WHERE ROW_NUM BETWEEN :startRow AND :endRow ORDER BY ROW_NUM
                        """, nativeQuery = true)
        List<QnaBoard> findByTitleContainingOrderByNumDesc(@Param("title") String title,
                        @Param("writer") String writer,
                        @Param("content") String content,
                        @Param("startRow") int startRow,
                        @Param("endRow") int endRow);

        // 게시물 개수 카운트
        @Query(value = "SELECT COUNT(*) FROM QNABOARD b WHERE b.title LIKE %:title% AND b.writer LIKE %:writer% AND b.content LIKE %:content%", nativeQuery = true)
        int countByTitleContaining(@Param("title") String title,
                        @Param("writer") String writer,
                        @Param("content") String content);
}
