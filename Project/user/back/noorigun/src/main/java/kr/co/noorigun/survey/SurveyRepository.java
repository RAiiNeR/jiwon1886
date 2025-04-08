package kr.co.noorigun.survey;

import java.util.List;
import java.util.Map;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import jakarta.transaction.Transactional;

public interface SurveyRepository extends JpaRepository<Survey, Long> {
     
    @Query(value = """
                SELECT s.num, s.SUB,SUM(b.surveycnt) AS cnt, s.sdate FROM SURVEY s,
                SURVEYCONTENT b WHERE s.num = b.subcode GROUP BY s.num, s.sub, s.sdate
         """, nativeQuery = true)

    List<Map<String,String>> findAllByOrderByNumDesc();// 쿼리문 자동으로 만들어 주고, 설문 조사를 num의 내림차순으로 조회

    // """ 전부 문자열로 인식 하는 것(enter를 했을 때)
    // 마지막부터 최신으로 업데이트 SELECT MAX(num)
    // 가장 마지막에 최신글
    @Query(value = """
            SELECT
            s.num AS surveyNUM,
            s.sub AS surveySub,
            s.code AS surveyCode,
            s.sdate AS surveyDate,
            sc.surveytype AS surveyType,
            sc.subcode AS sucCode,
            sc.surveytitle AS surveyTitle,
            sc.surveycnt AS surveyCnt
            FROM survey s, surveycontent sc
            WHERE s.num=sc.subcode
            AND s.num = (SELECT MAX(num) FROM survey)
            """, nativeQuery = true)

                                                   // index로만 받을 수 있어서 0부터 받기 (key가 필요 없음) -> map로도 가능은 하다
    List<Object[]> findLatestSurveyWithContents(); // 가장 최근 설문 조사와 그 설문 항목을 함께 조회
 
    @Query(value = """
            SELECT
            s.num AS surveyNUM,
            s.sub AS surveySub,
            s.code AS surveyCode,
            s.sdate AS surveyDate,
            sc.surveytype AS surveyType,
            sc.subcode AS sucCode,
            sc.surveytitle AS surveyTitle,
            sc.surveycnt AS surveyCnt
            FROM survey s, surveycontent sc
            WHERE s.num=sc.subcode
            AND s.num = :num
            """, nativeQuery = true)

    
    List<Object[]> findByNumSurveyWithContents(@Param("num")Long num); // 원하는 값을 가져오기 위헤
                                                                       // 특정 num 값을 가진 설문 조사와 관련된 설문 항목을 조회
    @Modifying
    @Transactional
    // 특정 설문 항목의 응답 수를 1씩 증가
    @Query(value = "UPDATE surveycontent SET surveycnt = surveycnt +1 WHERE subcode = :subcode AND surveytype = :surveytype   ", nativeQuery = true)
    void incrementSurveyCount(@Param("subcode") Long subcond, @Param("surveytype") String surveytype);

}
