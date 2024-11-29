package kr.co.noori.back.controller;

import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import kr.co.noori.back.service.CompleBoardService;
import kr.co.noori.back.vo.CompleBoardVO;

@RestController
@RequestMapping("/api/comple")
public class CompleBoardController {
    @Autowired
    private CompleBoardService compleBoardService;

    @GetMapping
    public List<Map<String,String>> compleboardlist() {
        return compleBoardService.list();
    }

    @GetMapping("/chart/{deptno}")
    public List<CompleBoardVO> detailCompleBoard(@PathVariable("deptno") Long deptno) {
        return compleBoardService.detail(deptno);
    }
}