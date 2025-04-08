package kr.co.noorigun.qna;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import kr.co.noorigun.vo.QcommVO;

@Service
public class QcommService {

    @Autowired
    private QcommDao qcommDao;

    //댓글 전체 조회
    public List<QcommVO> list() {
        return qcommDao.list();
    }

    //댓글 삭제
    public void delete(int num) {
        qcommDao.delete(num);
    }
}
