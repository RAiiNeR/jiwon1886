package kr.co.noorigun.vo;

import java.util.List;

import org.apache.ibatis.type.Alias;
import org.springframework.web.multipart.MultipartFile;

import lombok.Getter;
import lombok.Setter;

@Alias("evo")
@Setter
@Getter
public class EquipmentVO {
        private int num;
        private String rname; // 품목명
        private String state; // 품목 상태 (대여 가능 / 대여 불가)
        private int cnt; // 품목 수량
        private String edate; // 등록일
        private List<MultipartFile> mfiles; // 업로드된 파일들 (이미지 파일)
        private List<String> imgNames; // 파일명 (이미지 이름들)
        private int rcnt; // 대여된 수량
        private List<ReserveVO> reservations; // 예약자 목록
}
