package kr.co.ictstudy.back.memo;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/memo")
public class MemoController {
    @Autowired
    private MemoService memoService;

    @GetMapping
    public List<Memo> getAllMemos(){
        return memoService.getAllMemos();
    }

    @PostMapping
    public Memo creatMemo(@ModelAttribute MemoVO vo){
        System.out.println("Writer : "+vo.getWriter());
        System.out.println("Title : "+vo.getTitle());
        System.out.println("Content : "+vo.getMemocont());
        return memoService.createMemo(vo);
    }

    
}
