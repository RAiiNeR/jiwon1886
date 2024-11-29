package kr.co.ictstudy.back.memo;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MemoService {
    @Autowired
    private MemoRepository memoRepository;

    public List<Memo> getAllMemos(){
        return memoRepository.findAllByOrderByIdDesc();
    }

    public Memo createMemo(MemoVO vo){
        Memo memo = new Memo();
        memo.setWriter(vo.getWriter());
        memo.setTitle(vo.getTitle());
        memo.setMemocont(vo.getMemocont());
        memo.setMdate(new Date());
        return memoRepository.save(memo);
    }
}
