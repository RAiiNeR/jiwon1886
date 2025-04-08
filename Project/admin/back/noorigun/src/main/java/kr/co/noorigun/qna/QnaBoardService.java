package kr.co.noorigun.qna;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import kr.co.noorigun.vo.QnaBoardVO;

@Service
public class QnaBoardService {
    @Autowired // byname(promoteBoard를 불러온다)형식으로 매핑(springboot는 byname) -> 인터페이스
    private QnaBoardDao qnaBoardDao;

    public void add(QnaBoardVO vo) {//게시글 추가
        qnaBoardDao.add(vo);
    }

    //페이징 처리
    public Page<QnaBoardVO> list(int page, int size, String searchType, String searchValue) {
        int begin = (page - 1) * size + 1;
        int end = begin + size - 1;
        Map<String, String> map = new HashMap<>();
        map.put("searchType", searchType);
        map.put("searchValue", searchValue);
        map.put("begin", String.valueOf(begin));
        map.put("end", String.valueOf(end));
        List<QnaBoardVO> entity = qnaBoardDao.list(map);
        int totalContents = qnaBoardDao.counting(map);
        return new PageImpl<>(entity, PageRequest.of(page - 1, size), totalContents);
    }

    //해당번호 게시글 세부내용
    public QnaBoardVO detail(int num) {
        return qnaBoardDao.detail(num);
    }

    //해당 게시글 답변
    public int checkReply (int num){
        return qnaBoardDao.checkReply(num);
    }

    //해당 게시글 삭제
    public void delete(int num) {
        int chR = checkReply(num);
        if(chR != 0) qnaBoardDao.deleteReply(num);
        qnaBoardDao.delete(num);
    }

    //해당 게시글 수정
    public void update(QnaBoardVO vo) {
        qnaBoardDao.update(vo);
    }

}
