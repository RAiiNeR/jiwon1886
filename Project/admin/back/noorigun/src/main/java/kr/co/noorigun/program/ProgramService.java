package kr.co.noorigun.program;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.co.noorigun.vo.MemberVO;
import kr.co.noorigun.vo.ProgramVO;

@Service
public class ProgramService {
    @Autowired
    private ProgramDao programDao;

    public void add(ProgramVO vo){
        programDao.add(vo);
    }
    
    public List<ProgramVO> list(){
        return programDao.list();
    };

    public ProgramVO detail(int num) {
        return programDao.detail(num);  
    }

    public void delete(int num){
        programDao.delete(num);
    };
    
    public void update(ProgramVO vo){
        programDao.update(vo);
    };

    public List<MemberVO> memberlist(int num){
        return programDao.memberlist(num);
    }
}
