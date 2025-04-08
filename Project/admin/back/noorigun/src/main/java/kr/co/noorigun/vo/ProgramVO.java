package kr.co.noorigun.vo;


import org.apache.ibatis.type.Alias;
import org.springframework.web.multipart.MultipartFile;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Alias("program")
public class ProgramVO {
    private int num;
    private String title;//강의명
    private int age;//연령분류
    private String category;//종류
    private String place;//강의장
    private String content;//내용
    private String teacher;//강사명
    private String img;//이미지
    private int student;//수강생
    private int education;//교육정원
    private String startperiod;//강의수강 시작일
    private String endperiod;//강의수강 마감일
    private String startdeadline;//강의수강신청 시작일
    private String enddeadline;//강의수강신청 마감일
    private String starttime;//강의시작시간
    private String endtime;//강의종료시간
    private MultipartFile mfile;

    private int hit;//조회수
    private String pdate;//게시글 작성일


    // // 날짜를 String으로 변환하는 메서드
    // public void setStartperiod(Date startperiodDate) {
    //     if (startperiodDate != null) {
    //         SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss"); // 원하는 날짜 형식
    //         this.startperiod = sdf.format(startperiodDate);
    //     }
    // }

    // public void setEndperiod(Date endperiodDate) {
    //     if (endperiodDate != null) {
    //         SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss"); // 원하는 날짜 형식
    //         this.endperiod = sdf.format(endperiodDate);
    //     }
    // }

    // public void setStartdeadline(Date startdeadlineDate) {
    //     if (startdeadlineDate != null) {
    //         SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss"); // 원하는 날짜 형식
    //         this.startdeadline = sdf.format(startdeadlineDate);
    //     }
    // }

    // public void setEnddeadline(Date enddeadlineDate) {
    //     if (enddeadlineDate != null) {
    //         SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss"); // 원하는 날짜 형식
    //         this.enddeadline = sdf.format(enddeadlineDate);
    //     }
    // }
}