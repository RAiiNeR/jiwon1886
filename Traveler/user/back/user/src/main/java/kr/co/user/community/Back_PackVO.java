package kr.co.user.community;

import java.util.Date;
import java.util.List;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Data
@Setter
@Getter
public class Back_PackVO {
   private Long num; // PK
   private String title; // 제목
   private String content; // 내용
   private Date cdate; // 날짜
   private Long hit; // 조회수
   private Long heart; // 좋아요
   private int member; // 작성자(회원번호) -> MemberVO와 연결
   private Long roomNum; // 방 번호(게시글이 속한)
   private List<String> imgnames; // 업로드된 이미지 이름 리스트
   private List<MultipartFile> images; // 업로드할 이미지 파일 리스트
   private List<String> tag; //태그
}