package kr.co.noorigun.promote;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import kr.co.noorigun.vo.PB_IMGVO;
import kr.co.noorigun.vo.PromoteBoardVO;
import kr.co.noorigun.vo.SuggestionVO;

@Service
public class PromoteBoardService {
    @Autowired
    private PromoteBoardDao promoteBoardDao;

    // 게시글과 이미지추가
    public void add(PromoteBoardVO vo, List<PB_IMGVO> pbvo) {
        promoteBoardDao.add(vo); // 게시글 추가
        promoteBoardDao.addImg(pbvo);// 이미지 추가
    }

    // 게시글 목록 조회
    public Page<PromoteBoardVO> list(int page, int size, String searchValue) {
        int begin = (page - 1) * size + 1;
        int end = begin + size - 1;
        Map<String, String> map = new HashMap<>();
        map.put("searchValue", searchValue);
        map.put("begin", String.valueOf(begin));
        map.put("end", String.valueOf(end));
        List<PromoteBoardVO> entity = promoteBoardDao.list(map);
        int totalContents = promoteBoardDao.counting(searchValue);
        return new PageImpl(entity, PageRequest.of(page - 1, size), totalContents);
    }

    // num에 해당하는 홍보게시글 상세조회
    public PromoteBoardVO detail(int num) {
        // 게시글 상세정보를 DB에서 가져오기
        List<Map<String, Object>> maps = promoteBoardDao.detail(num);
        // 객체 선언
        PromoteBoardVO vo = null;
        for (Map<String, Object> map : maps) {
            if (vo == null) {
                vo = new PromoteBoardVO();
                vo.setNum(Integer.parseInt(String.valueOf(map.get("NUM"))));
                vo.setTitle((String) map.get("TITLE"));
                vo.setWriter((String) map.get("WRITER"));
                vo.setHit(Integer.parseInt(String.valueOf(map.get("HIT"))));
                vo.setContent((String) map.get("CONTENT"));
                vo.setPdate(String.valueOf(map.get("PDATE")));
                vo.setPlaceaddr((String) map.get("PLACEADDR"));
                vo.setPlacename((String) map.get("PLACENAME"));
                vo.setLatitude(Double.parseDouble(String.valueOf(map.get("LATITUDE"))));// 위도
                vo.setLongitude(Double.parseDouble(String.valueOf(map.get("LONGITUDE"))));// 경도
                vo.setImgNames(new ArrayList<>());// 이미지 파일 이름 담을 리스트 초기화
            }
            // 게시글의 이미지 파일이름을 리스트에 추가
            vo.getImgNames().add((String) map.get("IMGNAME"));
        }
        // 게시글정보랑 이미지담은 객체 반환
        return vo;
    }

    // 글 삭제
    public void delete(int num) {
        promoteBoardDao.delete(num);
    }

    // 자식 데이터 삭제
    public void deleteChild(int num) {
        promoteBoardDao.deleteChild(num);
    }

    // 수정
    public void update(PromoteBoardVO vo, List<PB_IMGVO> pbvoList) {
        // 게시글 내용 업데이트
        promoteBoardDao.update(vo);
        // 기존 이미지 삭제 후, 새로운 이미지 추가
        if (pbvoList != null && !pbvoList.isEmpty()) {
            for (PB_IMGVO pbvo : pbvoList) {
                promoteBoardDao.updateImage(pbvo);
            }
        }
    }

}
