package kr.co.test.test.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import kr.co.test.test.dao.BoardDao;
import kr.co.test.test.vo.BoardVO;

@Service
public class BoardService {
    //Autowired자체가 byname형식으로
    // => BoardDao를 boardDao로 불러온다
    //bytype과 byname중에서는 byname이 더 강하다
    //부트에서는 byname으로 맞춰줘야 한다
    @Autowired
    private BoardDao boardDao;
    //여기서부터는 인터페이스 추상메서드를 추가한다
    public void add(BoardVO vo) {
        boardDao.add(vo);
    }

    public List<BoardVO> list() {
        return boardDao.list();
    }

    // 디테일 들어갈때 hit도 실행시켜줘야 하니까 hit(num)이 추가로 있어야 함
    public BoardVO detail(int num) {
        hit(num);
        return boardDao.detail(num);
    }
    public void hit(int num) {
        boardDao.hit(num);
    }
    public void delete(int num) {
        boardDao.delete(num);
    }
}
